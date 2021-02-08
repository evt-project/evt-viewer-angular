import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsPartComponent } from './ms-part.component';

describe('MsPartComponent', () => {
  let component: MsPartComponent;
  let fixture: ComponentFixture<MsPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsPartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
