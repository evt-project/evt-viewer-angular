import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinboardComponent } from './pinboard.component';

describe('PinboardComponent', () => {
  let component: PinboardComponent;
  let fixture: ComponentFixture<PinboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
