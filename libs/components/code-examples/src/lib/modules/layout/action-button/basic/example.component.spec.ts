import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutActionButtonBasicExampleComponent } from './example.component';

describe('Action button basic example', () => {
  let fixture: ComponentFixture<LayoutActionButtonBasicExampleComponent>;
  let component: LayoutActionButtonBasicExampleComponent;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LayoutActionButtonBasicExampleComponent],
    });

    fixture = TestBed.createComponent(LayoutActionButtonBasicExampleComponent);
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

  it('should display two action buttons', () => {
    const buttons = element.querySelectorAll('sky-action-button');
    expect(buttons.length).toBe(2);
  });

  it('should display filter action button with correct content', () => {
    const buttons = element.querySelectorAll('sky-action-button');
    const filterButton = buttons[0];

    expect(
      filterButton.querySelector('sky-action-button-header')?.textContent?.trim(),
    ).toBe('Build a new list');
    expect(
      filterButton.querySelector('sky-action-button-details')?.textContent?.trim(),
    ).toBe('Start from scratch and fine-tune with filters.');
  });

  it('should display open action button with correct content', () => {
    const buttons = element.querySelectorAll('sky-action-button');
    const openButton = buttons[1];

    expect(
      openButton.querySelector('sky-action-button-header')?.textContent?.trim(),
    ).toBe('Open a saved list');
    expect(
      openButton.querySelector('sky-action-button-details')?.textContent?.trim(),
    ).toBe('Open a list with filters saved in the web view.');
  });

  it('should trigger filter action click', () => {
    spyOn(window, 'alert');

    const buttons = element.querySelectorAll('sky-action-button');
    const filterButton = buttons[0] as HTMLElement;
    filterButton.click();

    expect(window.alert).toHaveBeenCalledWith('Filter action clicked');
  });

  it('should trigger open action click', () => {
    spyOn(window, 'alert');

    const buttons = element.querySelectorAll('sky-action-button');
    const openButton = buttons[1] as HTMLElement;
    openButton.click();

    expect(window.alert).toHaveBeenCalledWith('Open action clicked');
  });
});
