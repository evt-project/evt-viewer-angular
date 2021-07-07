import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsDescSelectorComponent } from './ms-desc-selector.component';

describe('MsDescSelectorComponent', () => {
  let component: MsDescSelectorComponent;
  let fixture: ComponentFixture<MsDescSelectorComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ MsDescSelectorComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsDescSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
