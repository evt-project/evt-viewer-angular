import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NamedEntityDetailComponent } from './named-entity-detail.component';

describe('NamedEntityDetailComponent', () => {
  let component: NamedEntityDetailComponent;
  let fixture: ComponentFixture<NamedEntityDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NamedEntityDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NamedEntityDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
