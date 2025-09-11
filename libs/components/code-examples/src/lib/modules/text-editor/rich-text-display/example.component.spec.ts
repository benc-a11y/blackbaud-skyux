import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextEditorRichTextDisplayExampleComponent } from './example.component';

describe('Rich text display', () => {
  let component: TextEditorRichTextDisplayExampleComponent;
  let fixture: ComponentFixture<TextEditorRichTextDisplayExampleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TextEditorRichTextDisplayExampleComponent],
    });

    fixture = TestBed.createComponent(TextEditorRichTextDisplayExampleComponent);
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
