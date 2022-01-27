import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RenditionComponent } from './rendition.component';

describe('RenditionComponent', () => {
  let component: RenditionComponent;
  let fixture: ComponentFixture<RenditionComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [RenditionComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
