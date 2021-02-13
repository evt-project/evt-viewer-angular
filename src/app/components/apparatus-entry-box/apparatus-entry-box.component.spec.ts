import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApparatusEntryBoxComponent } from './apparatus-entry-box.component';

describe('ApparatusEntryBoxComponent', () => {
  let component: ApparatusEntryBoxComponent;
  let fixture: ComponentFixture<ApparatusEntryBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApparatusEntryBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApparatusEntryBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
