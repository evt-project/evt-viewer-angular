import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImageOnlyComponent } from './image-only.component';

describe('ImageOnlyComponent', () => {
  let component: ImageOnlyComponent;
  let fixture: ComponentFixture<ImageOnlyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageOnlyComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageOnlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
