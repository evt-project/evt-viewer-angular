import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionStmtComponent } from './edition-stmt.component';

describe('EditionStmtComponent', () => {
  let component: EditionStmtComponent;
  let fixture: ComponentFixture<EditionStmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditionStmtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditionStmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
