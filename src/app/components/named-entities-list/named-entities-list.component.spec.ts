import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NamedEntitiesListComponent } from './named-entities-list.component';

describe('NamedEntitiesListComponent', () => {
  let component: NamedEntitiesListComponent;
  let fixture: ComponentFixture<NamedEntitiesListComponent>;

  beforeEach(async(() => {
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
