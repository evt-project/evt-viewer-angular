import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PinboardPanelComponent } from './pinboard-panel.component';

describe('PinboardPanelComponent', () => {
  let component: PinboardPanelComponent;
  let fixture: ComponentFixture<PinboardPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PinboardPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinboardPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
