import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinnerComponent } from './pinner.component';

describe('PinnerComponent', () => {
  let component: PinnerComponent;
  let fixture: ComponentFixture<PinnerComponent>;

  beforeEach(async(() => {
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
