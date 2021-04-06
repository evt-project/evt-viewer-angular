import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtentComponent } from './extent.component';

describe('ExtentComponent', () => {
  let component: ExtentComponent;
  let fixture: ComponentFixture<ExtentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
