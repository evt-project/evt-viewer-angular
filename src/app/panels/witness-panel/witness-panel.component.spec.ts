import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WitnessPanelComponent } from './witness-panel.component';

describe('WitnessPanelComponent', () => {
  let component: WitnessPanelComponent;
  let fixture: ComponentFixture<WitnessPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WitnessPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WitnessPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
