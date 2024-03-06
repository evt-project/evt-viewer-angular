import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnaloguesComponent } from './analogues.component';

describe('AnaloguesComponent', () => {
  let component: AnaloguesComponent;
  let fixture: ComponentFixture<AnaloguesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnaloguesComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnaloguesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
