import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsItemComponent } from './ms-item.component';

describe('MsItemComponent', () => {
  let component: MsItemComponent;
  let fixture: ComponentFixture<MsItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
