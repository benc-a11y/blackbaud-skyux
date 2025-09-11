import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreIdExampleComponent } from './example.component';

describe('Core ID', () => {
  let component: CoreIdExampleComponent;
  let fixture: ComponentFixture<CoreIdExampleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreIdExampleComponent],
    });

    fixture = TestBed.createComponent(CoreIdExampleComponent);
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
