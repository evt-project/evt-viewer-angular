import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteButtonComponent } from './note-button.component';

describe('NoteButtonComponent', () => {
  let component: NoteButtonComponent;
  let fixture: ComponentFixture<NoteButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoteButtonComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
