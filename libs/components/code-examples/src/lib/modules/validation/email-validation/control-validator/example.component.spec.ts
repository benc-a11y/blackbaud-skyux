import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationEmailValidationControlValidatorExampleComponent } from './example.component';

describe('Email validation control validator', () => {
  let component: ValidationEmailValidationControlValidatorExampleComponent;
  let fixture: ComponentFixture<ValidationEmailValidationControlValidatorExampleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ValidationEmailValidationControlValidatorExampleComponent],
    });

    fixture = TestBed.createComponent(ValidationEmailValidationControlValidatorExampleComponent);
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
