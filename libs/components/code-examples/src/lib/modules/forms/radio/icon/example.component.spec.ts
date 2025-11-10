import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyRadioGroupHarness } from '@skyux/forms/testing';

import { FormsRadioIconExampleComponent } from './example.component';

describe('Icon radio group example', () => {
  async function setupTest(options: {
    dataSkyId: string;
  }): Promise<SkyRadioGroupHarness> {
    const fixture = TestBed.createComponent(FormsRadioIconExampleComponent);

    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyRadioGroupHarness.with({ dataSkyId: options.dataSkyId }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    return harness;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, FormsRadioIconExampleComponent],
    });
  });

  it('should have the appropriate heading text and radio buttons with hidden labels', async () => {
    const harness = await setupTest({ dataSkyId: 'radio-icon-group' });

    const radioButtons = await harness.getRadioButtons();

    await expectAsync(harness.getHeadingText()).toBeResolvedTo('View');
    await expectAsync(harness.getHeadingHidden()).toBeResolvedTo(true);

    expect(radioButtons.length).toBe(3);

    await expectAsync(radioButtons[0].getLabelText()).toBeResolvedTo('Table');
    await expectAsync(radioButtons[0].getLabelHidden()).toBeResolvedTo(true);

    await expectAsync(radioButtons[1].getLabelText()).toBeResolvedTo('List');
    await expectAsync(radioButtons[1].getLabelHidden()).toBeResolvedTo(true);

    await expectAsync(radioButtons[2].getLabelText()).toBeResolvedTo('Map');
    await expectAsync(radioButtons[2].getLabelHidden()).toBeResolvedTo(true);
  });

  it('should have the first radio button checked by default', async () => {
    const harness = await setupTest({ dataSkyId: 'radio-icon-group' });

    const radioButtons = await harness.getRadioButtons();

    await expectAsync(radioButtons[0].isChecked()).toBeResolvedTo(true);
    await expectAsync(radioButtons[1].isChecked()).toBeResolvedTo(false);
    await expectAsync(radioButtons[2].isChecked()).toBeResolvedTo(false);
  });

  it('should check radio buttons when clicked', async () => {
    const harness = await setupTest({ dataSkyId: 'radio-icon-group' });

    const radioButtons = await harness.getRadioButtons();

    await radioButtons[1].check();
    await expectAsync(radioButtons[0].isChecked()).toBeResolvedTo(false);
    await expectAsync(radioButtons[1].isChecked()).toBeResolvedTo(true);
    await expectAsync(radioButtons[2].isChecked()).toBeResolvedTo(false);

    await radioButtons[2].check();
    await expectAsync(radioButtons[0].isChecked()).toBeResolvedTo(false);
    await expectAsync(radioButtons[1].isChecked()).toBeResolvedTo(false);
    await expectAsync(radioButtons[2].isChecked()).toBeResolvedTo(true);
  });
});
