import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutFormatExampleComponent } from './example.component';

describe('Format example', () => {
  let fixture: ComponentFixture<LayoutFormatExampleComponent>;
  let component: LayoutFormatExampleComponent;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LayoutFormatExampleComponent],
    });

    fixture = TestBed.createComponent(LayoutFormatExampleComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display format component', () => {
    const format = element.querySelector('sky-format');
    expect(format).not.toBeNull();
  });

  it('should render formatted text with template arguments', () => {
    const format = element.querySelector('sky-format');
    expect(format).not.toBeNull();
  });
});
