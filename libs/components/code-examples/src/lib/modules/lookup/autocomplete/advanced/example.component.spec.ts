import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAutocompleteHarness } from '@skyux/lookup/testing';

import { LookupAutocompleteAdvancedExampleComponent } from './example.component';

describe('Advanced autocomplete example', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    harness: SkyAutocompleteHarness;
    fixture: ComponentFixture<LookupAutocompleteAdvancedExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      LookupAutocompleteAdvancedExampleComponent,
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
      imports: [LookupAutocompleteAdvancedExampleComponent],
    });
  });

  it('should set up farthest planet autocomplete input', async () => {
    const { harness, fixture } = await setupTest({
      dataSkyId: 'farthest-planet',
    });

    await harness.focus();
    await harness.enterText('nep');

    const searchResultsText = await harness.getSearchResultsText();

    expect(searchResultsText.length).toBe(1);
    expect(searchResultsText[0]).toContain('Neptune');

    const searchResults = await harness.getSearchResults();
    await searchResults[0].select();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call
    const value = (fixture.componentInstance as any).formGroup.get(
      'farthestPlanet',
    )?.value;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(value?.name).toBe('Neptune');
  });

  it('should limit search results to 2', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'farthest-planet',
    });

    await harness.focus();
    await harness.enterText('a');

    const searchResultsText = await harness.getSearchResultsText();

    expect(searchResultsText.length).toBe(2);
  });

  it('should require at least 3 characters to search', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'farthest-planet',
    });

    await harness.focus();
    await harness.enterText('a');

    const searchResultsText = await harness.getSearchResultsText();

    expect(searchResultsText.length).toBe(2);

    await harness.clear();
    await harness.enterText('ab');

    const searchResultsText2 = await harness.getSearchResultsText();

    expect(searchResultsText2.length).toBe(0);
  });

  it('should search against name and description properties', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'farthest-planet',
    });

    await harness.focus();
    await harness.enterText('solar');

    const searchResultsText = await harness.getSearchResultsText();

    expect(searchResultsText.length).toBeGreaterThan(0);
  });

  it('should fire selection change event', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'farthest-planet',
    });

    spyOn(window, 'alert');

    await harness.focus();
    await harness.enterText('mars');

    const searchResults = await harness.getSearchResults();
    await searchResults[0].select();

    expect(window.alert).toHaveBeenCalledWith('You selected Mars');
  });
});
