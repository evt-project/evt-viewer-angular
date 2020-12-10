import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManuscriptThumbnailsViewerComponent } from './manuscript-thumbnails-viewer.component';

describe('ManuscriptThumbnailsViewerComponent', () => {
  let component: ManuscriptThumbnailsViewerComponent;
  let fixture: ComponentFixture<ManuscriptThumbnailsViewerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManuscriptThumbnailsViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManuscriptThumbnailsViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
