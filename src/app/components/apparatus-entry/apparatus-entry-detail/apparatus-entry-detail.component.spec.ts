import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApparatusEntryDetailComponent } from './apparatus-entry-detail.component';

describe('ApparatusEntryDetailComponent', () => {
  let component: ApparatusEntryDetailComponent;
  let fixture: ComponentFixture<ApparatusEntryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApparatusEntryDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApparatusEntryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
