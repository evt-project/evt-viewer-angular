import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SourcesPanelComponent } from './sources-panel.component';

describe('SourcesPanelComponent', () => {
  let component: SourcesPanelComponent;
  let fixture: ComponentFixture<SourcesPanelComponent>;

  beforeEach(async(() => {
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
