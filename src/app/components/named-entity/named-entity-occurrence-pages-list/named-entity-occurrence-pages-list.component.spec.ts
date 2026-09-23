import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NamedEntityOccurrencePagesListComponent } from './named-entity-occurrence-pages-list.component';

describe('NamedEntityOccurrencePagesListComponent', () => {
  let component: NamedEntityOccurrencePagesListComponent;
  let fixture: ComponentFixture<NamedEntityOccurrencePagesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NamedEntityOccurrencePagesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NamedEntityOccurrencePagesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
