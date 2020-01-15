import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BibliographyItemComponent } from './bibliography-item.component';

describe('BibliographyItemComponent', () => {
  let component: BibliographyItemComponent;
  let fixture: ComponentFixture<BibliographyItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BibliographyItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BibliographyItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
