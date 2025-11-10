/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AngularTreeComponentAngularTreeBasicExampleComponent } from './example.component';

describe('Angular tree component basic example', () => {
  let fixture: ComponentFixture<AngularTreeComponentAngularTreeBasicExampleComponent>;
  let component: AngularTreeComponentAngularTreeBasicExampleComponent;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularTreeComponentAngularTreeBasicExampleComponent,
        NoopAnimationsModule,
      ],
    });

    fixture = TestBed.createComponent(
      AngularTreeComponentAngularTreeBasicExampleComponent,
    );
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display angular tree wrapper', () => {
    const wrapper = element.querySelector('sky-angular-tree-wrapper');
    expect(wrapper).not.toBeNull();
  });

  it('should display tree root', () => {
    const treeRoot = element.querySelector('tree-root');
    expect(treeRoot).not.toBeNull();
  });

  it('should have nodes data', () => {
    expect((component as any).nodes).toBeDefined();
    expect((component as any).nodes.length).toBeGreaterThan(0);
  });

  it('should have nodes with children', () => {
    expect((component as any).nodes[0].children).toBeDefined();
    expect((component as any).nodes[0].children.length).toBeGreaterThan(0);
  });

  it('should have nodes with help popover content', () => {
    expect((component as any).nodes[0].helpPopoverContent).toBeDefined();
  });
});
