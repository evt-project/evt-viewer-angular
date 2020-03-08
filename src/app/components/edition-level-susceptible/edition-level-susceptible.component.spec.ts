import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionLevelSusceptibleComponent } from './edition-level-susceptible.component';

describe('EditionLevelSusceptibleComponent', () => {
  let component: EditionLevelSusceptibleComponent;
  let fixture: ComponentFixture<EditionLevelSusceptibleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditionLevelSusceptibleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditionLevelSusceptibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
