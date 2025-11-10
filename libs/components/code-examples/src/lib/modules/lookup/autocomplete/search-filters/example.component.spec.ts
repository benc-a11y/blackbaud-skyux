import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAutocompleteHarness } from '@skyux/lookup/testing';

import { LookupAutocompleteSearchFiltersExampleComponent } from './example.component';

describe('Search filters autocomplete example', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    harness: SkyAutocompleteHarness;
    fixture: ComponentFixture<LookupAutocompleteSearchFiltersExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      LookupAutocompleteSearchFiltersExampleComponent,
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
      imports: [LookupAutocompleteSearchFiltersExampleComponent],
    });
  });

  it('should set up favorite color autocomplete input with search filters', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'favorite-color',
    });

    await harness.focus();
    await harness.enterText('b');

    const searchResultsText = await harness.getSearchResultsText();

    expect(searchResultsText.length).toBeGreaterThan(0);
    expect(searchResultsText).toContain('Blue');
    expect(searchResultsText).toContain('Brown');
    expect(searchResultsText).toContain('Black');
  });

  it('should filter out "Red" from search results', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'favorite-color',
    });

    await harness.focus();
    await harness.enterText('r');

    const searchResultsText = await harness.getSearchResultsText();

    expect(searchResultsText).not.toContain('Red');
    expect(searchResultsText).toContain('Green');
    expect(searchResultsText).toContain('Orange');
    expect(searchResultsText).toContain('Purple');
    expect(searchResultsText).toContain('Turquoise');
  });

  it('should select a color from filtered results', async () => {
    const { harness, fixture } = await setupTest({
      dataSkyId: 'favorite-color',
    });

    await harness.focus();
    await harness.enterText('blu');

    const searchResults = await harness.getSearchResults();
    await expectAsync(searchResults[0].getText()).toBeResolvedTo('Blue');

    await searchResults[0].select();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call
    const value = (fixture.componentInstance as any).formGroup.get(
      'favoriteColor',
    )?.value;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(value?.name).toBe('Blue');
  });

  it('should apply search filters consistently', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'favorite-color',
    });

    await harness.focus();
    await harness.enterText('red');

    const searchResultsText = await harness.getSearchResultsText();

    expect(searchResultsText).not.toContain('Red');
  });
});
