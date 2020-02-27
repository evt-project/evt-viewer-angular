import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightableComponent } from './highlightable.component';

describe('HighlightableComponent', () => {
  let component: HighlightableComponent;
  let fixture: ComponentFixture<HighlightableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HighlightableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighlightableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
