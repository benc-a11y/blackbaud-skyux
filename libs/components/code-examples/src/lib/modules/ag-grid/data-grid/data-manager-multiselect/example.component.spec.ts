/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AgGridDataGridDataManagerMultiselectExampleComponent } from './example.component';

describe('AG Grid data grid data manager multiselect example', () => {
  let fixture: ComponentFixture<AgGridDataGridDataManagerMultiselectExampleComponent>;
  let component: AgGridDataGridDataManagerMultiselectExampleComponent;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AgGridDataGridDataManagerMultiselectExampleComponent,
        NoopAnimationsModule,
      ],
    });

    fixture = TestBed.createComponent(
      AgGridDataGridDataManagerMultiselectExampleComponent,
    );
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display data manager', () => {
    const dataManager = element.querySelector('sky-data-manager');
    expect(dataManager).not.toBeNull();
  });

  it('should have items data', () => {
    expect((component as any).items).toBeDefined();
    expect((component as any).items.length).toBeGreaterThan(0);
  });
});
