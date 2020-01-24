import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NamedEntityRefComponent } from './named-entity-ref.component';

describe('NamedEntityRefComponent', () => {
  let component: NamedEntityRefComponent;
  let fixture: ComponentFixture<NamedEntityRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NamedEntityRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NamedEntityRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
