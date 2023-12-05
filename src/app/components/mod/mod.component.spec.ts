import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModComponent } from './mod.component';

describe('ModComponent', () => {
  let component: ModComponent;
  let fixture: ComponentFixture<ModComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
