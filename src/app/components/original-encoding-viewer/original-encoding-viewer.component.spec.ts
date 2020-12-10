import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OriginalEncodingViewerComponent } from './original-encoding-viewer.component';

describe('OriginalEncodingViewerComponent', () => {
  let component: OriginalEncodingViewerComponent;
  let fixture: ComponentFixture<OriginalEncodingViewerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OriginalEncodingViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OriginalEncodingViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
