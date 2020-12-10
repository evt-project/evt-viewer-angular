import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EvtInfoComponent } from './evt-info.component';

describe('EvtInfoComponent', () => {
  let component: EvtInfoComponent;
  let fixture: ComponentFixture<EvtInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EvtInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvtInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
