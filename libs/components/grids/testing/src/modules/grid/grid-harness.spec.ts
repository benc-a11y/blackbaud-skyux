import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyGridModule } from '@skyux/grids';

import { SkyGridHarness } from './grid-harness';

//#region Test component
@Component({
  selector: 'sky-grid-test',
  template: `
    <sky-grid
      data-sky-id="grid-test"
      [data]="gridData"
      [columns]="gridColumns"
    >
    </sky-grid>
  `,
  standalone: false,
})
class TestGridComponent {
  public gridData = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];

  public gridColumns = [
    { id: 'id', heading: 'ID', field: 'id' },
    { id: 'name', heading: 'Name', field: 'name' },
    { id: 'email', heading: 'Email', field: 'email' },
  ];
}
//#endregion Test component

describe('Grid harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    gridHarness: SkyGridHarness;
    fixture: ComponentFixture<TestGridComponent>;
    loader: HarnessLoader;
  }> {
    TestBed.configureTestingModule({
      declarations: [TestGridComponent],
      imports: [SkyGridModule, NoopAnimationsModule],
    });

    const fixture = TestBed.createComponent(TestGridComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const gridHarness: SkyGridHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyGridHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkyGridHarness);

    return { gridHarness, fixture, loader };
  }

  it('should get the grid from its data-sky-id', async () => {
    const { gridHarness } = await setupTest({
      dataSkyId: 'grid-test',
    });

    expect(gridHarness).toBeTruthy();
  });

  it('should get row and column counts', async () => {
    const { gridHarness, fixture } = await setupTest({
      dataSkyId: 'grid-test',
    });

    fixture.detectChanges();

    await expectAsync(gridHarness.getRowCount()).toBeResolvedTo(2);
    await expectAsync(gridHarness.getColumnCount()).toBeResolvedTo(3);
  });

  it('should get column headers', async () => {
    const { gridHarness, fixture } = await setupTest({
      dataSkyId: 'grid-test',
    });

    fixture.detectChanges();

    await expectAsync(gridHarness.getColumnHeaders()).toBeResolvedTo([
      'ID',
      'Name',
      'Email',
    ]);
  });

  it('should get cell text', async () => {
    const { gridHarness, fixture } = await setupTest({
      dataSkyId: 'grid-test',
    });

    fixture.detectChanges();

    await expectAsync(gridHarness.getCellText(0, 1)).toBeResolvedTo('John Doe');
    await expectAsync(gridHarness.getCellText(1, 2)).toBeResolvedTo('jane@example.com');
  });
});
