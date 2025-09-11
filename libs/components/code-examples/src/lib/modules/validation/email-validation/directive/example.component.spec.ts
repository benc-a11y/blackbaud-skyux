import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationEmailValidationDirectiveExampleComponent } from './example.component';

describe('Email validation directive', () => {
  let component: ValidationEmailValidationDirectiveExampleComponent;
  let fixture: ComponentFixture<ValidationEmailValidationDirectiveExampleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ValidationEmailValidationDirectiveExampleComponent],
    });

    fixture = TestBed.createComponent(ValidationEmailValidationDirectiveExampleComponent);
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
