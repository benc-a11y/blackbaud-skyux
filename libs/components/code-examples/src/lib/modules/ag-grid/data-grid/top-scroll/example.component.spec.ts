/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AgGridDataGridTopScrollExampleComponent } from './example.component';

describe('AG Grid data grid top scroll example', () => {
  let fixture: ComponentFixture<AgGridDataGridTopScrollExampleComponent>;
  let component: AgGridDataGridTopScrollExampleComponent;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AgGridDataGridTopScrollExampleComponent, NoopAnimationsModule],
    });

    fixture = TestBed.createComponent(AgGridDataGridTopScrollExampleComponent);
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
