import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditionLevelSelectorComponent } from './edition-level-selector.component';

describe('EditionLevelSelectorComponent', () => {
  let component: EditionLevelSelectorComponent;
  let fixture: ComponentFixture<EditionLevelSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditionLevelSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditionLevelSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
