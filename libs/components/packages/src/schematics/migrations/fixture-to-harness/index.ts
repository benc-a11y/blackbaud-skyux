import {
  Rule,
  SchematicContext,
  Tree,
  chain,
} from '@angular-devkit/schematics';
import * as ts from 'typescript';

interface FixtureToHarnessOptions {
  path?: string;
  dryRun?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars

export function fixtureToHarness(options: FixtureToHarnessOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('🔄 Starting fixture to harness migration...');
    
    const rules: Rule[] = [];
    
    tree.visit((filePath) => {
      if (filePath.endsWith('.ts') && !filePath.endsWith('.d.ts')) {
        const content = tree.read(filePath);
        if (content) {
          const sourceFile = ts.createSourceFile(
            filePath,
            content.toString(),
            ts.ScriptTarget.Latest,
            true
          );
          
          const hasFixtureImports = hasLegacyFixtureImports(sourceFile);
          const hasFixtureUsage = hasLegacyFixtureUsage(sourceFile);
          
          if (hasFixtureImports || hasFixtureUsage) {
            context.logger.info(`📝 Migrating file: ${filePath}`);
            rules.push(migrateFile(filePath));
          }
        }
      }
    });
    
    return chain(rules);
  };
}

function hasLegacyFixtureImports(sourceFile: ts.SourceFile): boolean {
  let hasFixtureImports = false;
  
  ts.forEachChild(sourceFile, (node) => {
    if (ts.isImportDeclaration(node)) {
      const importClause = node.importClause;
      if (importClause && importClause.namedBindings) {
        if (ts.isNamedImports(importClause.namedBindings)) {
          importClause.namedBindings.elements.forEach((element) => {
            if (element.name.text.includes('Fixture')) {
              hasFixtureImports = true;
            }
          });
        }
      }
    }
  });
  
  return hasFixtureImports;
}

function hasLegacyFixtureUsage(sourceFile: ts.SourceFile): boolean {
  let hasFixtureUsage = false;
  
  function visit(node: ts.Node): void {
    if (ts.isNewExpression(node) && node.expression) {
      const expressionText = node.expression.getText();
      if (expressionText.includes('Fixture')) {
        hasFixtureUsage = true;
      }
    }
    
    ts.forEachChild(node, visit);
  }
  
  visit(sourceFile);
  return hasFixtureUsage;
}

function migrateFile(filePath: string): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const content = tree.read(filePath);
    if (!content) return tree;
    
    let fileContent = content.toString();
    
    const fixtureMappings = {
      'SkyCheckboxFixture': 'SkyCheckboxHarness',
      'SkyModalFixture': 'SkyModalHarness',
      'SkyAlertFixture': 'SkyAlertHarness',
      'SkyInfiniteScrollFixture': 'SkyInfiniteScrollHarness',
      'SkyRadioFixture': 'SkyRadioHarness',
      'SkyPagingFixture': 'SkyPagingHarness',
      'SkySortFixture': 'SkySortHarness'
    };
    
    Object.entries(fixtureMappings).forEach(([fixture, harness]) => {
      const fixtureImportRegex = new RegExp(`import\\s*{[^}]*${fixture}[^}]*}\\s*from\\s*['"][^'"]*legacy[^'"]*['"];?`, 'g');
      const harnessImport = `import { ${harness} } from '@skyux/testing';`;
      
      fileContent = fileContent.replace(fixtureImportRegex, harnessImport);
      
      const fixtureUsageRegex = new RegExp(`new\\s+${fixture}\\s*\\(`, 'g');
      fileContent = fileContent.replace(fixtureUsageRegex, `await loader.getHarness(${harness}.with(`);
      
      const propertyAccessRegex = new RegExp(`\\.([a-zA-Z]+)(?!\\()`, 'g');
      fileContent = fileContent.replace(propertyAccessRegex, (match, property) => {
        return `.get${property.charAt(0).toUpperCase() + property.slice(1)}()`;
      });
    });
    
    fileContent = addAsyncAwaitPatterns(fileContent);
    
    fileContent = addHarnessLoaderSetup(fileContent);
    
    tree.overwrite(filePath, fileContent);
    context.logger.info(`✅ Migrated: ${filePath}`);
    
    return tree;
  };
}

function addAsyncAwaitPatterns(content: string): string {
  content = content.replace(
    /it\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*\(\s*\)\s*=>\s*{/g,
    "it('$1', async () => {"
  );
  
  content = content.replace(
    /(\w+Harness)\.get(\w+)\(\)/g,
    'await $1.get$2()'
  );
  
  return content;
}

function addHarnessLoaderSetup(content: string): string {
  if (content.includes('TestbedHarnessEnvironment.loader')) {
    return content;
  }
  
  const harnessImports = `import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';`;
  
  const importRegex = /(import\s+.*?;\s*\n)+/;
  content = content.replace(importRegex, (match) => match + harnessImports + '\n');
  
  const setupPattern = `
    const loader: HarnessLoader = TestbedHarnessEnvironment.loader(fixture);`;
  
  content = content.replace(
    /(TestBed\.createComponent\([^)]+\);)/,
    '$1' + setupPattern
  );
  
  return content;
}
