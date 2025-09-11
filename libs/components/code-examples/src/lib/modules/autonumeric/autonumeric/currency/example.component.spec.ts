import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutonumericCurrencyExampleComponent } from './example.component';

describe('Autonumeric currency', () => {
  let component: AutonumericCurrencyExampleComponent;
  let fixture: ComponentFixture<AutonumericCurrencyExampleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AutonumericCurrencyExampleComponent],
    });

    fixture = TestBed.createComponent(AutonumericCurrencyExampleComponent);
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
