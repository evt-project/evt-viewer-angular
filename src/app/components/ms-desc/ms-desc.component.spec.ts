import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsDescComponent } from './ms-desc.component';

describe('MsDescComponent', () => {
  let component: MsDescComponent;
  let fixture: ComponentFixture<MsDescComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsDescComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
