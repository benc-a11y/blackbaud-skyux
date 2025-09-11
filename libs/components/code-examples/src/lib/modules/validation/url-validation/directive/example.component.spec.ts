import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationUrlValidationDirectiveExampleComponent } from './example.component';

describe('URL validation directive', () => {
  let component: ValidationUrlValidationDirectiveExampleComponent;
  let fixture: ComponentFixture<ValidationUrlValidationDirectiveExampleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ValidationUrlValidationDirectiveExampleComponent],
    });

    fixture = TestBed.createComponent(ValidationUrlValidationDirectiveExampleComponent);
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
