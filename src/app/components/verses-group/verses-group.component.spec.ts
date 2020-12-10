import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VersesGroupComponent } from './verses-group.component';

describe('VersesGroupComponent', () => {
  let component: VersesGroupComponent;
  let fixture: ComponentFixture<VersesGroupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VersesGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VersesGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
