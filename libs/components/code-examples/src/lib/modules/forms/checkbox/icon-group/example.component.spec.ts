import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  SkyCheckboxGroupHarness,
  SkyCheckboxHarness,
} from '@skyux/forms/testing';

import { FormsCheckboxIconGroupExampleComponent } from './example.component';

describe('Icon checkbox group example', () => {
  async function setupCheckboxGroupTest(options: {
    dataSkyId: string;
  }): Promise<SkyCheckboxGroupHarness> {
    const fixture = TestBed.createComponent(
      FormsCheckboxIconGroupExampleComponent,
    );

    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyCheckboxGroupHarness.with({ dataSkyId: options.dataSkyId }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    return harness;
  }

  async function setupCheckboxTest(options: {
    dataSkyId: string;
  }): Promise<SkyCheckboxHarness> {
    const fixture = TestBed.createComponent(
      FormsCheckboxIconGroupExampleComponent,
    );

    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyCheckboxHarness.with({ dataSkyId: options.dataSkyId }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    return harness;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, FormsCheckboxIconGroupExampleComponent],
    });
  });

  it('should have the appropriate heading text and checkboxes with hidden labels', async () => {
    const harness = await setupCheckboxGroupTest({
      dataSkyId: 'checkbox-icon-group',
    });

    const checkboxButtons = await harness.getCheckboxes();

    await expectAsync(harness.getHeadingText()).toBeResolvedTo(
      'Text formatting',
    );
    await expectAsync(harness.getHeadingHidden()).toBeResolvedTo(true);

    expect(checkboxButtons.length).toBe(3);

    await expectAsync(checkboxButtons[0].getLabelText()).toBeResolvedTo('Bold');
    await expectAsync(checkboxButtons[0].getLabelHidden()).toBeResolvedTo(true);

    await expectAsync(checkboxButtons[1].getLabelText()).toBeResolvedTo(
      'Italic',
    );
    await expectAsync(checkboxButtons[1].getLabelHidden()).toBeResolvedTo(true);

    await expectAsync(checkboxButtons[2].getLabelText()).toBeResolvedTo(
      'Underline',
    );
    await expectAsync(checkboxButtons[2].getLabelHidden()).toBeResolvedTo(true);
  });

  it('should check and uncheck checkboxes', async () => {
    const harness = await setupCheckboxTest({ dataSkyId: 'bold-checkbox' });

    await expectAsync(harness.isChecked()).toBeResolvedTo(false);
    await harness.check();
    await expectAsync(harness.isChecked()).toBeResolvedTo(true);
    await harness.uncheck();
    await expectAsync(harness.isChecked()).toBeResolvedTo(false);
  });

  it('should have stacked layout', async () => {
    const harness = await setupCheckboxGroupTest({
      dataSkyId: 'checkbox-icon-group',
    });

    await expectAsync(harness.getStacked()).toBeResolvedTo(true);
  });
});
