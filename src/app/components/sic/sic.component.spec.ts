import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SicComponent } from './sic.component';

describe('SicComponent', () => {
  let component: SicComponent;
  let fixture: ComponentFixture<SicComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
