import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AgGridDataGridDataManagerMultiselectExampleComponent } from './example.component';

describe('AG Grid data grid data manager multiselect', () => {
  let component: AgGridDataGridDataManagerMultiselectExampleComponent;
  let fixture: ComponentFixture<AgGridDataGridDataManagerMultiselectExampleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AgGridDataGridDataManagerMultiselectExampleComponent, NoopAnimationsModule],
    });

    fixture = TestBed.createComponent(AgGridDataGridDataManagerMultiselectExampleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the component template', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled).toBeTruthy();
  });
});
