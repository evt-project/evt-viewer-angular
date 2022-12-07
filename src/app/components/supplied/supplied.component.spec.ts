import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SuppliedComponent } from './supplied.component';

describe('SuppliedComponent', () => {
  let component: SuppliedComponent;
  let fixture: ComponentFixture<SuppliedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SuppliedComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuppliedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
