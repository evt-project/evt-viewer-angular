import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EncodingDescComponent } from './encoding-desc.component';

describe('EncodingDescComponent', () => {
  let component: EncodingDescComponent;
  let fixture: ComponentFixture<EncodingDescComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ EncodingDescComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EncodingDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
