import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VersionPanelComponent } from './version-panel.component';

describe('VersionPanelComponent', () => {
  let component: VersionPanelComponent;
  let fixture: ComponentFixture<VersionPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VersionPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
