import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletionComponent } from './deletion.component';

describe('DeletionComponent', () => {
  let component: DeletionComponent;
  let fixture: ComponentFixture<DeletionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
