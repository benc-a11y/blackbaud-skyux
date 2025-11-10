/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { LayoutPageSummaryBasicExampleComponent } from './example.component';

describe('Page summary basic example', () => {
  let fixture: ComponentFixture<LayoutPageSummaryBasicExampleComponent>;
  let component: LayoutPageSummaryBasicExampleComponent;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LayoutPageSummaryBasicExampleComponent, NoopAnimationsModule],
    });

    fixture = TestBed.createComponent(LayoutPageSummaryBasicExampleComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display page summary', () => {
    const pageSummary = element.querySelector('sky-page-summary');
    expect(pageSummary).not.toBeNull();
  });

  it('should display alert when showAlert is true', () => {
    const alert = element.querySelector('sky-page-summary-alert');
    expect(alert).not.toBeNull();
  });

  it('should display image when showImage is true', () => {
    const image = element.querySelector('sky-page-summary-image');
    expect(image).not.toBeNull();
    if (image) {
      expect(image.querySelector('sky-avatar')).not.toBeNull();
    }
  });

  it('should display title when showTitle is true', () => {
    const title = element.querySelector('sky-page-summary-title');
    expect(title?.textContent?.trim()).toBe('Robert C. Hernandez');
  });

  it('should display subtitle when showSubtitle is true', () => {
    const subtitle = element.querySelector('sky-page-summary-subtitle');
    expect(subtitle?.textContent?.trim()).toBe('Board member');
  });

  it('should display status when showStatus is true', () => {
    const status = element.querySelector('sky-page-summary-status');
    expect(status).not.toBeNull();
    if (status) {
      expect(status.querySelectorAll('sky-label').length).toBe(2);
    }
  });

  it('should display content when showContent is true', () => {
    const content = element.querySelector('sky-page-summary-content');
    expect(content).not.toBeNull();
  });

  it('should display key info when showKeyInfo is true', () => {
    const keyInfo = element.querySelector('sky-page-summary-key-info');
    expect(keyInfo).not.toBeNull();
    if (keyInfo) {
      expect(keyInfo.querySelectorAll('sky-key-info').length).toBe(2);
    }
  });

  it('should toggle title visibility', () => {
    (component as any).showTitle = false;
    fixture.detectChanges();

    const title = element.querySelector('sky-page-summary-title');
    expect(title).toBeNull();

    (component as any).showTitle = true;
    fixture.detectChanges();

    const titleAfter = element.querySelector('sky-page-summary-title');
    expect(titleAfter).not.toBeNull();
  });

  it('should toggle subtitle visibility', () => {
    (component as any).showSubtitle = false;
    fixture.detectChanges();

    const subtitle = element.querySelector('sky-page-summary-subtitle');
    expect(subtitle).toBeNull();
  });

  it('should toggle image visibility', () => {
    (component as any).showImage = false;
    fixture.detectChanges();

    const image = element.querySelector('sky-page-summary-image');
    expect(image).toBeNull();
  });

  it('should toggle status visibility', () => {
    (component as any).showStatus = false;
    fixture.detectChanges();

    const status = element.querySelector('sky-page-summary-status');
    expect(status).toBeNull();
  });

  it('should toggle key info visibility', () => {
    (component as any).showKeyInfo = false;
    fixture.detectChanges();

    const keyInfo = element.querySelector('sky-page-summary-key-info');
    expect(keyInfo).toBeNull();
  });

  it('should toggle content visibility', () => {
    (component as any).showContent = false;
    fixture.detectChanges();

    const content = element.querySelector('sky-page-summary-content');
    expect(content).toBeNull();
  });

  it('should toggle alert visibility', () => {
    (component as any).showAlert = false;
    fixture.detectChanges();

    const alert = element.querySelector('sky-page-summary-alert');
    expect(alert).toBeNull();
  });

  it('should display checkboxes for configuration', () => {
    const checkboxes = element.querySelectorAll('sky-checkbox');
    expect(checkboxes.length).toBe(7);
  });
});
