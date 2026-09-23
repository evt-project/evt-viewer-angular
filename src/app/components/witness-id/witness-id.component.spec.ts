import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WitnessIdComponent } from './witness-id.component';

describe('WitnessIdComponent', () => {
  let component: WitnessIdComponent;
  let fixture: ComponentFixture<WitnessIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WitnessIdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WitnessIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
