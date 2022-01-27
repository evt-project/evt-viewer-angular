import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SamplingDeclComponent } from './sampling-decl.component';

describe('SamplingDeclComponent', () => {
  let component: SamplingDeclComponent;
  let fixture: ComponentFixture<SamplingDeclComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ SamplingDeclComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplingDeclComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
