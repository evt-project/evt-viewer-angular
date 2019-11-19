import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextTextComponent } from './text-text.component';

describe('TextTextComponent', () => {
  let component: TextTextComponent;
  let fixture: ComponentFixture<TextTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
