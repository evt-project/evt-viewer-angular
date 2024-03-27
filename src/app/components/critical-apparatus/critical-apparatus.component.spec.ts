import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriticalApparatusComponent } from './critical-apparatus.component';

describe('CriticalApparatusComponent', () => {
  let component: CriticalApparatusComponent;
  let fixture: ComponentFixture<CriticalApparatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CriticalApparatusComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CriticalApparatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
