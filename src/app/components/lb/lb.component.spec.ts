import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LbComponent } from './lb.component';

describe('LbComponent', () => {
  let component: LbComponent;
  let fixture: ComponentFixture<LbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
