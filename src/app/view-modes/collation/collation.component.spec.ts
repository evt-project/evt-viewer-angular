import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CollationComponent } from './collation.component';

describe('CollationComponent', () => {
  let component: CollationComponent;
  let fixture: ComponentFixture<CollationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CollationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
