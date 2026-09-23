import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynopsisEditionLevelSelectorComponent } from './synopsis-edition-level-selector.component';

describe('SynopsisEditionLevelSelectorComponent', () => {
  let component: SynopsisEditionLevelSelectorComponent;
  let fixture: ComponentFixture<SynopsisEditionLevelSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SynopsisEditionLevelSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SynopsisEditionLevelSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
