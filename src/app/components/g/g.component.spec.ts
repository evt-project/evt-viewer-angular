import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GComponent } from './g.component';

describe('GComponent', () => {
  let component: GComponent;
  let fixture: ComponentFixture<GComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
