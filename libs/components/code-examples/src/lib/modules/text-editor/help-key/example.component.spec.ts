import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TextEditorHelpKeyExampleComponent } from './example.component';

describe('Text editor with help key', () => {
  let component: TextEditorHelpKeyExampleComponent;
  let fixture: ComponentFixture<TextEditorHelpKeyExampleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TextEditorHelpKeyExampleComponent, NoopAnimationsModule],
    });

    fixture = TestBed.createComponent(TextEditorHelpKeyExampleComponent);
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
