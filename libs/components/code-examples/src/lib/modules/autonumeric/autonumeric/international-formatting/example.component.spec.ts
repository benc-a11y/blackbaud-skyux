import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutonumericInternationalFormattingExampleComponent } from './example.component';

describe('Autonumeric international formatting', () => {
  let component: AutonumericInternationalFormattingExampleComponent;
  let fixture: ComponentFixture<AutonumericInternationalFormattingExampleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AutonumericInternationalFormattingExampleComponent],
    });

    fixture = TestBed.createComponent(AutonumericInternationalFormattingExampleComponent);
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
