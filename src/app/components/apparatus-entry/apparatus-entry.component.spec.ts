import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApparatusEntryComponent } from './apparatus-entry.component';

describe('ApparatusEntryComponent', () => {
  let component: ApparatusEntryComponent;
  let fixture: ComponentFixture<ApparatusEntryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApparatusEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApparatusEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
