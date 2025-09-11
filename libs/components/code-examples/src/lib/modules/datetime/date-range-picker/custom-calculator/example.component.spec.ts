import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DatetimeDateRangePickerCustomCalculatorExampleComponent } from './example.component';

describe('Date range picker custom calculator', () => {
  let component: DatetimeDateRangePickerCustomCalculatorExampleComponent;
  let fixture: ComponentFixture<DatetimeDateRangePickerCustomCalculatorExampleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DatetimeDateRangePickerCustomCalculatorExampleComponent, NoopAnimationsModule],
    });

    fixture = TestBed.createComponent(DatetimeDateRangePickerCustomCalculatorExampleComponent);
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
