/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutDefinitionListBasicExampleComponent } from './example.component';

describe('Definition list basic example', () => {
  let fixture: ComponentFixture<LayoutDefinitionListBasicExampleComponent>;
  let component: LayoutDefinitionListBasicExampleComponent;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LayoutDefinitionListBasicExampleComponent],
    });

    fixture = TestBed.createComponent(
      LayoutDefinitionListBasicExampleComponent,
    );
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display definition list', () => {
    const definitionList = element.querySelector('sky-definition-list');
    expect(definitionList).not.toBeNull();
  });

  it('should display definition list heading', () => {
    const heading = element.querySelector('sky-definition-list-heading');
    expect(heading?.textContent?.trim()).toBe('Definition list heading');
  });

  it('should display all definition list items', () => {
    const contents = element.querySelectorAll('sky-definition-list-content');
    expect(contents.length).toBe(4);
  });

  it('should display labels for all items', () => {
    const labels = element.querySelectorAll('sky-definition-list-label');
    expect(labels.length).toBe(4);
    expect(labels[0].textContent?.trim()).toBe('Field 1');
    expect(labels[1].textContent?.trim()).toBe('Field 2');
    expect(labels[2].textContent?.trim()).toBe('Field 3');
    expect(labels[3].textContent?.trim()).toBe('Field 4');
  });

  it('should display values for items with defined values', () => {
    const values = element.querySelectorAll('sky-definition-list-value');
    expect(values.length).toBe(4);
    expect(values[0].textContent?.trim()).toBe('Field 1 value');
    expect(values[1].textContent?.trim()).toBe('Field 2 value');
    expect(values[3].textContent?.trim()).toBe('Field 4 value');
  });

  it('should have items array with correct structure', () => {
    expect((component as any).items.length).toBe(4);
    expect((component as any).items[0].label).toBe('Field 1');
    expect((component as any).items[0].value).toBe('Field 1 value');
    expect((component as any).items[2].value).toBeUndefined();
  });
});
