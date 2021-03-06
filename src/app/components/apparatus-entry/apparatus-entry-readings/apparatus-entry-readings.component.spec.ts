import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApparatusEntryReadingsComponent } from './apparatus-entry-readings.component';

describe('ApparatusEntryReadingsComponent', () => {
  let component: ApparatusEntryReadingsComponent;
  let fixture: ComponentFixture<ApparatusEntryReadingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApparatusEntryReadingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApparatusEntryReadingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
