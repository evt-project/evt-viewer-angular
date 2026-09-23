import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApparatusEntryExponentComponent } from './apparatus-entry-exponent.component';

describe('ApparatusEntryExponentComponent', () => {
  let component: ApparatusEntryExponentComponent;
  let fixture: ComponentFixture<ApparatusEntryExponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApparatusEntryExponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApparatusEntryExponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
