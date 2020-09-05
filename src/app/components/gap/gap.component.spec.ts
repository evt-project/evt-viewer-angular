import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GapComponent } from './gap.component';

describe('GapComponent', () => {
  let component: GapComponent;
  let fixture: ComponentFixture<GapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GapComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
