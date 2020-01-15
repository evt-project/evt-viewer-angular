import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalListsComponent } from './global-lists.component';

describe('GlobalListsComponent', () => {
  let component: GlobalListsComponent;
  let fixture: ComponentFixture<GlobalListsComponent>;

  beforeEach(async(() => {
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
