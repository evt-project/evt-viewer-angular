import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectInfoSectionComponent } from './project-info-section.component';

describe('ProjectInfoSectionComponent', () => {
  let component: ProjectInfoSectionComponent;
  let fixture: ComponentFixture<ProjectInfoSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectInfoSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectInfoSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
