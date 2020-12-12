import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReadingTextComponent } from './reading-text.component';

describe('ReadingTextComponent', () => {
  let component: ReadingTextComponent;
  let fixture: ComponentFixture<ReadingTextComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadingTextComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadingTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
