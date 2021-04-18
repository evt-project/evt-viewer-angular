import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysDescComponent } from './phys-desc.component';

describe('PhysDescComponent', () => {
  let component: PhysDescComponent;
  let fixture: ComponentFixture<PhysDescComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysDescComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
