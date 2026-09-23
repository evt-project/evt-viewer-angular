import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynopsisXmlIdSelectorComponent } from './synopsis-xml-id-selector.component';

describe('SynopsisXmlIdSelectorComponent', () => {
  let component: SynopsisXmlIdSelectorComponent;
  let fixture: ComponentFixture<SynopsisXmlIdSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SynopsisXmlIdSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SynopsisXmlIdSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
