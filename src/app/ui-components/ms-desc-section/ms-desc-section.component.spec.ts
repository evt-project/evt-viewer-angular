import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsDescSectionComponent } from './ms-desc-section.component';

describe('MsDescSectionComponent', () => {
  let component: MsDescSectionComponent;
  let fixture: ComponentFixture<MsDescSectionComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ MsDescSectionComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsDescSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
