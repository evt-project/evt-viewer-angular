import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GlobalListsComponent } from './global-lists.component';

describe('GlobalListsComponent', () => {
  let component: GlobalListsComponent;
  let fixture: ComponentFixture<GlobalListsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
