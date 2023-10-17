import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceNoteComponent } from './source-note.component';

describe('SourceNoteComponent', () => {
  let component: SourceNoteComponent;
  let fixture: ComponentFixture<SourceNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceNoteComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
