import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesStmtComponent } from './notes-stmt.component';

describe('NotesStmtComponent', () => {
  let component: NotesStmtComponent;
  let fixture: ComponentFixture<NotesStmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotesStmtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesStmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
