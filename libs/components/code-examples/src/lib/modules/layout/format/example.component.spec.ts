import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutFormatExampleComponent } from './example.component';

describe('Layout format', () => {
  let component: LayoutFormatExampleComponent;
  let fixture: ComponentFixture<LayoutFormatExampleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LayoutFormatExampleComponent],
    });

    fixture = TestBed.createComponent(LayoutFormatExampleComponent);
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
