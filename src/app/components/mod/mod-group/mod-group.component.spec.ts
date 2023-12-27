import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModGroupComponent } from './mod-group.component';

describe('ModGroupComponent', () => {
  let component: ModGroupComponent;
  let fixture: ComponentFixture<ModGroupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModGroupComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
