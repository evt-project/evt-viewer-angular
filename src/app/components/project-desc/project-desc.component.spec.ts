import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectDescComponent } from './project-desc.component';

describe('ProjectDescComponent', () => {
  let component: ProjectDescComponent;
  let fixture: ComponentFixture<ProjectDescComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDescComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
