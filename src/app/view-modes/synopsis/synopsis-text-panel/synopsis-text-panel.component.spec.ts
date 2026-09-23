import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynopsisTextPanelComponent } from './synopsis-text-panel.component';

describe('SynopsisTextPanelComponent', () => {
  let component: SynopsisTextPanelComponent;
  let fixture: ComponentFixture<SynopsisTextPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SynopsisTextPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SynopsisTextPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
