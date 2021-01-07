import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NamedEntityRefComponent } from './named-entity-ref.component';

describe('NamedEntityRefComponent', () => {
  let component: NamedEntityRefComponent;
  let fixture: ComponentFixture<NamedEntityRefComponent>;

  beforeEach(waitForAsync(() => {
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
