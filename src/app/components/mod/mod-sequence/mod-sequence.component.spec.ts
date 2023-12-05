import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModSequenceComponent } from './mod-sequence.component';

describe('ModSequenceComponent', () => {
  let component: ModSequenceComponent;
  let fixture: ComponentFixture<ModSequenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModSequenceComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
