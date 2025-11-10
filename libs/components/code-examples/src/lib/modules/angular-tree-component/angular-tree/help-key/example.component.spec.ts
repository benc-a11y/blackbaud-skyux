/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AngularTreeComponentAngularTreeHelpKeyExampleComponent } from './example.component';

describe('Angular tree component help key example', () => {
  let fixture: ComponentFixture<AngularTreeComponentAngularTreeHelpKeyExampleComponent>;
  let component: AngularTreeComponentAngularTreeHelpKeyExampleComponent;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularTreeComponentAngularTreeHelpKeyExampleComponent,
        NoopAnimationsModule,
      ],
    });

    fixture = TestBed.createComponent(
      AngularTreeComponentAngularTreeHelpKeyExampleComponent,
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
});
