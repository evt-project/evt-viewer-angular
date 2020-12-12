import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NamedEntityRelationComponent } from './named-entity-relation.component';

describe('NamedEntityRelationComponent', () => {
  let component: NamedEntityRelationComponent;
  let fixture: ComponentFixture<NamedEntityRelationComponent>;

  beforeEach(waitForAsync(() => {
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
