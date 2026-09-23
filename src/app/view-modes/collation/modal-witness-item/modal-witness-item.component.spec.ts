import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalWitnessItemComponent } from './modal-witness-item.component';

describe('ModalWitnessItemComponent', () => {
  let component: ModalWitnessItemComponent;
  let fixture: ComponentFixture<ModalWitnessItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalWitnessItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalWitnessItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
