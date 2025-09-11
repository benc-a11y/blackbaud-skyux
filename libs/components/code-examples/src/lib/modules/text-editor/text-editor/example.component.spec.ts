import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TextEditorExampleComponent } from './example.component';

describe('Text editor', () => {
  let component: TextEditorExampleComponent;
  let fixture: ComponentFixture<TextEditorExampleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TextEditorExampleComponent, NoopAnimationsModule],
    });

    fixture = TestBed.createComponent(TextEditorExampleComponent);
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
