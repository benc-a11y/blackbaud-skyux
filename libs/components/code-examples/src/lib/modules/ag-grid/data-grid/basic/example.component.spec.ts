import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AgGridDataGridBasicExampleComponent } from './example.component';

describe('AG Grid data grid basic', () => {
  let component: AgGridDataGridBasicExampleComponent;
  let fixture: ComponentFixture<AgGridDataGridBasicExampleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AgGridDataGridBasicExampleComponent, NoopAnimationsModule],
    });

    fixture = TestBed.createComponent(AgGridDataGridBasicExampleComponent);
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
