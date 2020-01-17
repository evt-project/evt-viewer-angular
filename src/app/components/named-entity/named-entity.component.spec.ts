import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NamedEntityComponent } from './named-entity.component';

describe('NamedEntityComponent', () => {
  let component: NamedEntityComponent;
  let fixture: ComponentFixture<NamedEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NamedEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NamedEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
