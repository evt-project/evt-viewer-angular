import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NamedEntityOccurrenceComponent } from './named-entity-occurrence.component';

describe('NamedEntityOccurrenceComponent', () => {
  let component: NamedEntityOccurrenceComponent;
  let fixture: ComponentFixture<NamedEntityOccurrenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NamedEntityOccurrenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NamedEntityOccurrenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
