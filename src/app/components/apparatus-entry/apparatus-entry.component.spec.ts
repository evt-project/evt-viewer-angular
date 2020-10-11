import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApparatusEntryComponent } from './apparatus-entry.component';

describe('ApparatusEntryComponent', () => {
  let component: ApparatusEntryComponent;
  let fixture: ComponentFixture<ApparatusEntryComponent>;

  beforeEach(async(() => {
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
