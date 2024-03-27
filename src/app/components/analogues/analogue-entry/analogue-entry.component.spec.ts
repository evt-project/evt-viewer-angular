import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnalogueEntryComponent } from './analogue-entry.component';

describe('AnalogueEntryComponent', () => {
  let component: AnalogueEntryComponent;
  let fixture: ComponentFixture<AnalogueEntryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalogueEntryComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalogueEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
