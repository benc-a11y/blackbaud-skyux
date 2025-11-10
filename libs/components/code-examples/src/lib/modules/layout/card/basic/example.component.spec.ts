/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { LayoutCardBasicExampleComponent } from './example.component';

describe('Card basic example', () => {
  let fixture: ComponentFixture<LayoutCardBasicExampleComponent>;
  let component: LayoutCardBasicExampleComponent;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LayoutCardBasicExampleComponent, NoopAnimationsModule],
    });

    fixture = TestBed.createComponent(LayoutCardBasicExampleComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display large and small cards', () => {
    const cards = element.querySelectorAll('sky-card');
    expect(cards.length).toBe(2);

    const largeCard = cards[0];
    const smallCard = cards[1];

    expect(
      largeCard.querySelector('sky-card-title')?.textContent?.trim(),
    ).toBe('Large card');
    expect(
      smallCard.querySelector('sky-card-title')?.textContent?.trim(),
    ).toBe('Small card');
  });

  it('should display card content', () => {
    const cards = element.querySelectorAll('sky-card');
    const largeCard = cards[0];
    const smallCard = cards[1];

    expect(largeCard.querySelector('sky-card-content')).not.toBeNull();
    expect(smallCard.querySelector('sky-card-content')).not.toBeNull();
  });

  it('should display card actions', () => {
    const cards = element.querySelectorAll('sky-card');
    const largeCard = cards[0];
    const smallCard = cards[1];

    expect(largeCard.querySelector('sky-card-actions button')).not.toBeNull();
    expect(smallCard.querySelector('sky-card-actions sky-dropdown')).not.toBeNull();
  });

  it('should trigger alert when action button is clicked', () => {
    spyOn(window, 'alert');

    const actionButton = element.querySelector('sky-card-actions button') as HTMLButtonElement;
    actionButton.click();

    expect(window.alert).toHaveBeenCalledWith('Action clicked!');
  });

  it('should toggle title visibility', () => {
    (component as any).showTitle = false;
    fixture.detectChanges();

    const titles = element.querySelectorAll('sky-card-title');
    expect(titles.length).toBe(0);

    (component as any).showTitle = true;
    fixture.detectChanges();

    const titlesAfter = element.querySelectorAll('sky-card-title');
    expect(titlesAfter.length).toBe(2);
  });

  it('should toggle content visibility', () => {
    (component as any).showContent = false;
    fixture.detectChanges();

    const contents = element.querySelectorAll('sky-card-content');
    expect(contents.length).toBe(0);

    (component as any).showContent = true;
    fixture.detectChanges();

    const contentsAfter = element.querySelectorAll('sky-card-content');
    expect(contentsAfter.length).toBe(2);
  });

  it('should toggle action visibility', () => {
    (component as any).showAction = false;
    fixture.detectChanges();

    const actions = element.querySelectorAll('sky-card-actions');
    expect(actions.length).toBe(0);

    (component as any).showAction = true;
    fixture.detectChanges();

    const actionsAfter = element.querySelectorAll('sky-card-actions');
    expect(actionsAfter.length).toBe(2);
  });

  it('should display checkboxes for configuration', () => {
    const checkboxes = element.querySelectorAll('sky-checkbox');
    expect(checkboxes.length).toBe(4);
  });
});
