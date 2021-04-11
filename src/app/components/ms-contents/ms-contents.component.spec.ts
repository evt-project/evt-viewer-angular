import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsContentsComponent } from './ms-contents.component';

describe('MsContentsComponent', () => {
  let component: MsContentsComponent;
  let fixture: ComponentFixture<MsContentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsContentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
