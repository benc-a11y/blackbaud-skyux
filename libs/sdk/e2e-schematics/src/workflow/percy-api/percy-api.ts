import { Logger } from '../verify-e2e/verify-e2e';

interface Build {
  id: string;
  type: 'builds';
  attributes: {
    'build-number': number;
    partial: boolean;
    'web-url': string;
    'commit-html-url': string;
    'branch-html-url': string;
    'pull-request-html-url': string;
    state: string;
    'review-state': string;
    'review-state-reason': string;
    'is-pull-request': boolean;
    'pull-request-number': number;
    'pull-request-title': string;
    'total-snapshots': number;
    'total-open-comments': number;
    'failed-snapshots-count': number;
    'failure-reason': string;
    'failure-details': string;
    'finished-at': string;
    'finalized-at': string;
    'approved-at': string;
    'created-at': string;
    'updated-at': string;
  };
}

export interface BuildSummary {
  project: string;
  state:
    | 'unsaved'
    | 'pending'
    | 'processing'
    | 'finished'
    | 'failed'
    | 'expired'
    | 'waiting'
    | undefined;
  approved: boolean;
  removedSnapshots: string[];
}

export type Fetch = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

type FetchJson = <T extends object>(url: string, name: string) => Promise<T>;

interface Snapshot {
  type: 'snapshots';
  id: string;
  attributes: {
    name: string;
  };
}

function getFetchJson(
  fetchClient: Fetch,
): FetchJson {
  return async (url: string, name: string) => {
    return await retryWithExponentialBackoff(
      async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        try {
          const response = await fetchClient(url, { signal: controller.signal });
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const res = await response.json();
          if (res.data) {
            return res.data;
          } else {
            throw new Error(`Invalid response format for ${name}: ${JSON.stringify(res, null, 2)}`);
          }
        } catch (error) {
          clearTimeout(timeoutId);
          if ((error as Error).name === 'AbortError') {
            throw new Error(`Timeout after 30s fetching ${name}`);
          }
          throw error;
        }
      },
      3,
      1000,
      `fetch ${name}`
    );
  };
}

export async function checkPercyBuild(
  project: string,
  buildId: string,
  logger: Logger,
  /* istanbul ignore next */
  fetchClient: Fetch = fetch,
): Promise<Partial<BuildSummary>> {
  const fetchJson = getFetchJson(fetchClient);

  try {
    const isHealthy = await checkPercyApiHealth(fetchClient, logger);
    if (!isHealthy) {
      logger.warning(`Percy API is not available, skipping build check for ${project}`);
      return {
        project,
        state: undefined,
        approved: false,
        removedSnapshots: [],
      };
    }

    const build = await getBuild(buildId, fetchJson);

    if (build?.id && `${build.id}` === `${buildId}`) {
      const finished = build.attributes.state === 'finished';
      const approved =
        finished && build.attributes['review-state'] === 'approved';
      const removedSnapshots = finished
        ? await getRemovedSnapshots(build.id, fetchJson)
        : [];

      return {
        project,
        state: build.attributes.state as BuildSummary['state'],
        approved,
        removedSnapshots,
      };
    } else {
      logger.warning(`No Percy build found for ${project} build ${buildId}`);
    }
  } catch (error) {
    logger.error(`Error checking Percy build for ${project}: ${(error as Error).message}`);
    logger.info(`Continuing without Percy verification for ${project} due to API error`);
  }
  return {
    project,
    state: undefined,
    approved: false,
    removedSnapshots: [],
  };
}

function buildIsApproved(previousBuild: Build | undefined): boolean {
  if (previousBuild?.id) {
    return (
      previousBuild.attributes.state === 'finished' &&
      previousBuild.attributes['review-state'] === 'approved' &&
      ![
        'changes_requested_snapshot',
        'changes_requested_snapshot_previously',
        'failed_snapshots',
        'missing_snapshots',
        'unreviewed_snapshots',
        'user_rejected',
      ].includes(previousBuild.attributes['review-state-reason'])
    );
  }
  return false;
}

/**
 * Called from .github/actions/e2e-affected/action.yml
 */
export async function getLastGoodPercyBuild(
  project: string,
  shaArray: string[],
  allowDeletedScreenshots: boolean,
  logger: Logger,
  /* istanbul ignore next */
  fetchClient: Fetch = fetch,
): Promise<{ lastGoodCommit: string; buildId: number }> {
  if (shaArray.length === 0) {
    return { lastGoodCommit: '', buildId: 0 };
  }
  const fetchJson = getFetchJson(fetchClient);
  try {
    const projectId = await getProjectId(project, logger, fetchJson);
    const [previousBuild] = await getBuilds(
      projectId,
      shaArray,
      [],
      1,
      fetchJson,
    );
    if (buildIsApproved(previousBuild)) {
      logger.info(`Found ${previousBuild.attributes['web-url']}`);
      if (!allowDeletedScreenshots) {
        const removedSnapshots = await getRemovedSnapshots(
          previousBuild.id,
          fetchJson,
        );
        if (removedSnapshots.length > 0) {
          // Force the build to re-run.
          logger.warning(
            `Percy build ${previousBuild?.id} has removed screenshots. Re-running.`,
          );
          return { lastGoodCommit: '', buildId: 0 };
        }
      }
      const lastGoodCommit = previousBuild.attributes['commit-html-url']
        .split('/')
        .pop() as string;
      const buildId = Number(
        previousBuild.attributes['web-url'].split('/').pop(),
      );
      return { lastGoodCommit, buildId };
    }
    logger.warning(
      `The last build was not finished and/or approved. Re-running.`,
    );
  } catch (error) {
    logger.error(`Error checking Percy: ${error}`);
  }
  return { lastGoodCommit: '', buildId: 0 };
}

/**
 * Called from .github/actions/e2e-affected/action.yml
 */
export async function getPercyTargetCommit(
  project: string,
  shaArray: string[],
  logger: Logger,
  /* istanbul ignore next */
  fetchClient: Fetch = fetch,
): Promise<string> {
  if (shaArray.length === 0) {
    return '';
  }
  const fetchJson = getFetchJson(fetchClient);

  function chunk(shaArray: string[], number: number): string[][] {
    const result = [];
    for (let i = 0; i < shaArray.length; i += number) {
      result.push(shaArray.slice(i, i + number));
    }
    return result;
  }

  const shaArrayBatchesOf25 = chunk(shaArray, 25);
  try {
    const projectId = await getProjectId(project, logger, fetchJson);
    for (const shaArrayBatch of shaArrayBatchesOf25) {
      const build = await getBuilds(
        projectId,
        shaArrayBatch,
        ['finished'],
        1,
        fetchJson,
      ).then((builds) => builds.pop());
      if (build?.id) {
        return build.attributes['commit-html-url'].split('/').pop() as string;
      }
    }
    return '';
  } catch (error) {
    logger.error(`Error checking Percy: ${error}`);
    return '';
  }
}

async function getProjectId(
  slug: string,
  logger: Logger,
  fetchJson: FetchJson,
): Promise<string> {
  return await fetchJson<{ id: string }>(
    `https://percy.io/api/v1/projects?project_slug=${slug}`,
    'Percy project ID',
  ).then((response) => {
    if (response.id) {
      return response.id;
    } else {
      logger.error(
        `Percy project ID response for ${slug}: ${JSON.stringify(response)}`,
      );
      return Promise.reject(
        `Percy project ID response for ${slug}: ${JSON.stringify(response)}`,
      );
    }
  });
}

async function getBuilds(
  projectId: string,
  shas: string[],
  states: string[],
  limit: number,
  fetchJson: FetchJson,
): Promise<Build[]> {
  const shaFilter = shas.map((sha) => `&filter[shas][]=${sha}`).join('');
  const stateFilter = states
    .map((state) => `&filter[state][]=${state}`)
    .join('');
  return await fetchJson<Build[]>(
    `https://percy.io/api/v1/builds?project_id=${projectId}${shaFilter}${stateFilter}&page[limit]=${limit}`,
    'Percy builds',
  ).then((builds) => builds.filter((build) => build.type === 'builds'));
}

async function getBuild(
  buildId: string,
  fetchJson: FetchJson,
): Promise<Build | undefined> {
  return await fetchJson<Build>(
    `https://percy.io/api/v1/builds/${buildId}`,
    `Percy build ${buildId}`,
  ).then((build) => {
    if (build.type === 'builds') {
      return build;
    }
    return undefined;
  });
}

async function getRemovedSnapshots(
  buildId: string,
  fetchJson: FetchJson,
): Promise<string[]> {
  return await fetchJson<Snapshot[]>(
    `https://percy.io/api/v1/builds/${buildId}/removed-snapshots`,
    'removed snapshots',
  ).then((response) =>
    response
      .filter((snapshot) => snapshot.type === 'snapshots')
      .map((snapshot: Snapshot) => snapshot.attributes.name)
      .sort((a: string, b: string) => a.localeCompare(b)),
  );
}

async function retryWithExponentialBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number,
  baseDelayMs: number,
  operationName: string
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw new Error(`Failed to ${operationName} after ${maxRetries} attempts: ${lastError.message}`);
      }
      
      const shouldRetry = lastError.message.includes('HTTP 429') || 
                         lastError.message.includes('HTTP 5') ||
                         lastError.message.includes('Timeout') ||
                         lastError.message.includes('fetch');
      
      if (!shouldRetry) {
        throw lastError;
      }
      
      const delayMs = baseDelayMs * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  
  throw lastError!;
}

async function checkPercyApiHealth(
  fetchClient: Fetch,
  logger: Logger
): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetchClient('https://percy.io/api/v1/user', { 
      signal: controller.signal,
      method: 'HEAD'
    });
    clearTimeout(timeoutId);
    
    return response.ok;
  } catch (error) {
    logger.info(`Percy API health check failed: ${(error as Error).message}`);
    return false;
  }
}
