import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LacunaComponent } from './lacuna.component';

describe('LacunaComponent', () => {
  let component: LacunaComponent;
  let fixture: ComponentFixture<LacunaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LacunaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LacunaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
