import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvtInfoComponent } from './evt-info.component';

describe('EvtInfoComponent', () => {
  let component: EvtInfoComponent;
  let fixture: ComponentFixture<EvtInfoComponent>;

  beforeEach(async(() => {
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
