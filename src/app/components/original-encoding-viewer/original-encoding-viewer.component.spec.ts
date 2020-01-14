import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OriginalEncodingViewerComponent } from './original-encoding-viewer.component';

describe('OriginalEncodingViewerComponent', () => {
  let component: OriginalEncodingViewerComponent;
  let fixture: ComponentFixture<OriginalEncodingViewerComponent>;

  beforeEach(async(() => {
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
