import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorialDeclComponent } from './editorial-decl.component';

describe('EditorialDeclComponent', () => {
  let component: EditorialDeclComponent;
  let fixture: ComponentFixture<EditorialDeclComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ EditorialDeclComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorialDeclComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
