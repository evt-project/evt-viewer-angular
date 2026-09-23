import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadingsSequenceComponent } from './readings-sequence.component';

describe('ReadingsSequenceComponent', () => {
  let component: ReadingsSequenceComponent;
  let fixture: ComponentFixture<ReadingsSequenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadingsSequenceComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadingsSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
