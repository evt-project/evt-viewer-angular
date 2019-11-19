import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WitnessPanelComponent } from './witness-panel.component';

describe('WitnessPanelComponent', () => {
  let component: WitnessPanelComponent;
  let fixture: ComponentFixture<WitnessPanelComponent>;

  beforeEach(async(() => {
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
