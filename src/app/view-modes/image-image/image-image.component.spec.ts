import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageImageComponent } from './image-image.component';

describe('ImageImageComponent', () => {
  let component: ImageImageComponent;
  let fixture: ComponentFixture<ImageImageComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ ImageImageComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
