import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GenericElementComponent } from './generic-element.component';

describe('GenericElementComponent', () => {
  let component: GenericElementComponent;
  let fixture: ComponentFixture<GenericElementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
