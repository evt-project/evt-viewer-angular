import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NamedEntitiesListComponent } from './named-entities-list.component';

describe('NamedEntitiesListComponent', () => {
  let component: NamedEntitiesListComponent;
  let fixture: ComponentFixture<NamedEntitiesListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NamedEntitiesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NamedEntitiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
