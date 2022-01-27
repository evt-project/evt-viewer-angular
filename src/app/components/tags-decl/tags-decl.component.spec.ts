import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagsDeclComponent } from './tags-decl.component';

describe('TagsDeclComponent', () => {
  let component: TagsDeclComponent;
  let fixture: ComponentFixture<TagsDeclComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ TagsDeclComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsDeclComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
