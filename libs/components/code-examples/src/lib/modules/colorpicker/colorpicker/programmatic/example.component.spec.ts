import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ColorpickerProgrammaticExampleComponent } from './example.component';

describe('Colorpicker programmatic', () => {
  let component: ColorpickerProgrammaticExampleComponent;
  let fixture: ComponentFixture<ColorpickerProgrammaticExampleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ColorpickerProgrammaticExampleComponent, NoopAnimationsModule],
    });

    fixture = TestBed.createComponent(ColorpickerProgrammaticExampleComponent);
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
