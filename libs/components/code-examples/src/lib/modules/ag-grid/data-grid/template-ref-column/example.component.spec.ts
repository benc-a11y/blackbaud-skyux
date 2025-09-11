import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AgGridDataGridTemplateRefColumnExampleComponent } from './example.component';

describe('AG Grid data grid template ref column', () => {
  let component: AgGridDataGridTemplateRefColumnExampleComponent;
  let fixture: ComponentFixture<AgGridDataGridTemplateRefColumnExampleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AgGridDataGridTemplateRefColumnExampleComponent, NoopAnimationsModule],
    });

    fixture = TestBed.createComponent(AgGridDataGridTemplateRefColumnExampleComponent);
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
