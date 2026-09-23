import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynopsisPageSelector } from './synopsis-page-selector.component';

describe('SynopsisPageSelectorComponent', () => {
  let component: SynopsisPageSelector;
  let fixture: ComponentFixture<SynopsisPageSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SynopsisPageSelector ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SynopsisPageSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
