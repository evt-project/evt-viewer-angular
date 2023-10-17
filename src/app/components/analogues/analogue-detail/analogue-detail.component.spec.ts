import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalogueDetailComponent } from './analogue-detail.component';

describe('AnalogueDetailComponent', () => {
  let component: AnalogueDetailComponent;
  let fixture: ComponentFixture<AnalogueDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalogueDetailComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalogueDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
