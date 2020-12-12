import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PinnerComponent } from './pinner.component';

describe('PinnerComponent', () => {
  let component: PinnerComponent;
  let fixture: ComponentFixture<PinnerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
