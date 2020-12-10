import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OsdComponent } from './osd.component';

describe('OsdComponent', () => {
  let component: OsdComponent;
  let fixture: ComponentFixture<OsdComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OsdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OsdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
