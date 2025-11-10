/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AgGridDataGridDataManagerExampleComponent } from './example.component';

describe('AG Grid data grid data manager example', () => {
  let fixture: ComponentFixture<AgGridDataGridDataManagerExampleComponent>;
  let component: AgGridDataGridDataManagerExampleComponent;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AgGridDataGridDataManagerExampleComponent,
        NoopAnimationsModule,
      ],
    });

    fixture = TestBed.createComponent(
      AgGridDataGridDataManagerExampleComponent,
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
