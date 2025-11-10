/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { LayoutActionButtonPermalinkExampleComponent } from './example.component';

describe('Action button permalink example', () => {
  let fixture: ComponentFixture<LayoutActionButtonPermalinkExampleComponent>;
  let component: LayoutActionButtonPermalinkExampleComponent;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LayoutActionButtonPermalinkExampleComponent],
      providers: [provideRouter([])],
    });

    fixture = TestBed.createComponent(
      LayoutActionButtonPermalinkExampleComponent,
    );
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display action button container', () => {
    const container = element.querySelector('sky-action-button-container');
    expect(container).not.toBeNull();
  });

  it('should display two action buttons with permalinks', () => {
    const buttons = element.querySelectorAll('sky-action-button');
    expect(buttons.length).toBe(2);
  });

  it('should configure URL permalink', () => {
    expect((component as any).url).toBeDefined();
    expect((component as any).url.url).toBe('https://www.stackblitz.com');
  });

  it('should configure router link permalink', () => {
    expect((component as any).routerlink).toBeDefined();
    expect((component as any).routerlink.route).toBeDefined();
    expect(
      (component as any).routerlink.route?.extras?.queryParams?.['component'],
    ).toBe('MyComponent');
  });

  it('should display link action button with correct content', () => {
    const buttons = element.querySelectorAll('sky-action-button');
    const linkButton = buttons[0];

    expect(
      linkButton.querySelector('sky-action-button-header')?.textContent?.trim(),
    ).toBe('Open a link');
    expect(
      linkButton.querySelector('sky-action-button-details')?.textContent?.trim(),
    ).toBe('Open a link.');
  });

  it('should display router link action button with correct content', () => {
    const buttons = element.querySelectorAll('sky-action-button');
    const routerButton = buttons[1];

    expect(
      routerButton.querySelector('sky-action-button-header')?.textContent?.trim(),
    ).toBe('Open a router link');
    expect(
      routerButton.querySelector('sky-action-button-details')?.textContent?.trim(),
    ).toBe('Open a router link.');
  });
});
