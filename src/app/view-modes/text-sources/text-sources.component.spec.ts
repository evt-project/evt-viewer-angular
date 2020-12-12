import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TextSourcesComponent } from './text-sources.component';

describe('TextSourcesComponent', () => {
  let component: TextSourcesComponent;
  let fixture: ComponentFixture<TextSourcesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TextSourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextSourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
