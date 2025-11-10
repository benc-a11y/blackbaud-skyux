import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAutocompleteHarness } from '@skyux/lookup/testing';

import { LookupAutocompleteCustomSearchExampleComponent } from './example.component';

describe('Custom search autocomplete example', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    harness: SkyAutocompleteHarness;
    fixture: ComponentFixture<LookupAutocompleteCustomSearchExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      LookupAutocompleteCustomSearchExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyAutocompleteHarness.with({ dataSkyId: options.dataSkyId }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    return { harness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LookupAutocompleteCustomSearchExampleComponent],
    });
  });

  it('should set up largest ocean autocomplete input with preselected value', async () => {
    const { harness, fixture } = await setupTest({
      dataSkyId: 'largest-ocean',
    });

    await expectAsync(harness.getValue()).toBeResolvedTo('Arctic');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call
    const value = (fixture.componentInstance as any).formGroup.get(
      'largestOcean',
    )?.value;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(value?.title).toBe('Arctic');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(value?.id).toBe(1);
  });

  it('should search using custom search function', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'largest-ocean',
    });

    await harness.focus();
    await harness.clear();
    await harness.enterText('pac');

    const searchResultsText = await harness.getSearchResultsText();

    expect(searchResultsText.length).toBe(1);
    expect(searchResultsText[0]).toContain('Pacific');
  });

  it('should select an ocean from search results', async () => {
    const { harness, fixture } = await setupTest({
      dataSkyId: 'largest-ocean',
    });

    await harness.focus();
    await harness.clear();
    await harness.enterText('atl');

    const searchResults = await harness.getSearchResults();
    await expectAsync(searchResults[0].getText()).toBeResolvedTo(
      jasmine.stringContaining('Atlantic'),
    );

    await searchResults[0].select();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call
    const value = (fixture.componentInstance as any).formGroup.get(
      'largestOcean',
    )?.value;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(value?.title).toBe('Atlantic');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(value?.id).toBe(2);
  });

  it('should handle async search with custom function', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'largest-ocean',
    });

    await harness.focus();
    await harness.clear();
    await harness.enterText('ind');

    const searchResultsText = await harness.getSearchResultsText();

    expect(searchResultsText.length).toBe(1);
    expect(searchResultsText[0]).toContain('Indian');
  });
});
