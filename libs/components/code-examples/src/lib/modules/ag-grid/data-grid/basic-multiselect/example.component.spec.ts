import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AgGridDataGridBasicMultiselectExampleComponent } from './example.component';

describe('AG Grid data grid basic multiselect', () => {
  let component: AgGridDataGridBasicMultiselectExampleComponent;
  let fixture: ComponentFixture<AgGridDataGridBasicMultiselectExampleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AgGridDataGridBasicMultiselectExampleComponent, NoopAnimationsModule],
    });

    fixture = TestBed.createComponent(AgGridDataGridBasicMultiselectExampleComponent);
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
