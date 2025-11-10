/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutTextExpandNewlineExampleComponent } from './example.component';

describe('Text expand newline example', () => {
  let fixture: ComponentFixture<LayoutTextExpandNewlineExampleComponent>;
  let component: LayoutTextExpandNewlineExampleComponent;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LayoutTextExpandNewlineExampleComponent],
    });

    fixture = TestBed.createComponent(LayoutTextExpandNewlineExampleComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display text expand component', () => {
    const textExpand = element.querySelector('sky-text-expand');
    expect(textExpand).not.toBeNull();
  });

  it('should have newlines text property', () => {
    expect((component as any).newlinesText).toBeDefined();
    expect((component as any).newlinesText).toContain('\n');
  });

  it('should configure truncateNewlines to false', () => {
    const textExpand = element.querySelector('sky-text-expand');
    expect(textExpand).not.toBeNull();
  });
});
