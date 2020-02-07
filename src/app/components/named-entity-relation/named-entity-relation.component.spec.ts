import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NamedEntityRelationComponent } from './named-entity-relation.component';

describe('NamedEntityRelationComponent', () => {
  let component: NamedEntityRelationComponent;
  let fixture: ComponentFixture<NamedEntityRelationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NamedEntityRelationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NamedEntityRelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
