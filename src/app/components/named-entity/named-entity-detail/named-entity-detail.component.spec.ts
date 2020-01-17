import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NamedEntityDetailComponent } from './named-entity-detail.component';

describe('NamedEntityDetailComponent', () => {
  let component: NamedEntityDetailComponent;
  let fixture: ComponentFixture<NamedEntityDetailComponent>;

  beforeEach(async(() => {
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
