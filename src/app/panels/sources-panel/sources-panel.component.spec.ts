import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SourcesPanelComponent } from './sources-panel.component';

describe('SourcesPanelComponent', () => {
  let component: SourcesPanelComponent;
  let fixture: ComponentFixture<SourcesPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SourcesPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SourcesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
