/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AgGridDataGridBasicMultiselectExampleComponent } from './example.component';

describe('AG Grid data grid basic multiselect example', () => {
  let fixture: ComponentFixture<AgGridDataGridBasicMultiselectExampleComponent>;
  let component: AgGridDataGridBasicMultiselectExampleComponent;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AgGridDataGridBasicMultiselectExampleComponent,
        NoopAnimationsModule,
      ],
    });

    fixture = TestBed.createComponent(
      AgGridDataGridBasicMultiselectExampleComponent,
    );
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display ag-grid wrapper', () => {
    const wrapper = element.querySelector('sky-ag-grid-wrapper');
    expect(wrapper).not.toBeNull();
  });

  it('should display ag-grid-angular component', () => {
    const agGrid = element.querySelector('ag-grid-angular');
    expect(agGrid).not.toBeNull();
  });

  it('should have grid data', () => {
    expect((component as any).gridData).toBeDefined();
    expect((component as any).gridData.length).toBeGreaterThan(0);
  });

  it('should have grid options configured', () => {
    expect((component as any).gridOptions).toBeDefined();
    expect((component as any).gridOptions.columnDefs).toBeDefined();
  });
});
