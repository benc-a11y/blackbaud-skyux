import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutonumericPresetExampleComponent } from './example.component';

describe('Autonumeric preset', () => {
  let component: AutonumericPresetExampleComponent;
  let fixture: ComponentFixture<AutonumericPresetExampleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AutonumericPresetExampleComponent],
    });

    fixture = TestBed.createComponent(AutonumericPresetExampleComponent);
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
