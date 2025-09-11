import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutonumericOptionsProviderExampleComponent } from './example.component';

describe('Autonumeric options provider', () => {
  let component: AutonumericOptionsProviderExampleComponent;
  let fixture: ComponentFixture<AutonumericOptionsProviderExampleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AutonumericOptionsProviderExampleComponent],
    });

    fixture = TestBed.createComponent(AutonumericOptionsProviderExampleComponent);
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
