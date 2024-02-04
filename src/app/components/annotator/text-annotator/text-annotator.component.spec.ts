import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextAnnotatorComponent } from './text-annotator.component';

describe('TextAnnotatorComponent', () => {
  let component: TextAnnotatorComponent;
  let fixture: ComponentFixture<TextAnnotatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextAnnotatorComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextAnnotatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
