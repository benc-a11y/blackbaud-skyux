import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationUrlValidationControlValidatorExampleComponent } from './example.component';

describe('URL validation control validator', () => {
  let component: ValidationUrlValidationControlValidatorExampleComponent;
  let fixture: ComponentFixture<ValidationUrlValidationControlValidatorExampleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ValidationUrlValidationControlValidatorExampleComponent],
    });

    fixture = TestBed.createComponent(ValidationUrlValidationControlValidatorExampleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the component template', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled).toBeTruthy();
  });
});
