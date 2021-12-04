import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesStmtComponent } from './series-stmt.component';

describe('SeriesStmtComponent', () => {
  let component: SeriesStmtComponent;
  let fixture: ComponentFixture<SeriesStmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeriesStmtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesStmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
