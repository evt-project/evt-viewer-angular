import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VersesGroupComponent } from './verses-group.component';

describe('VersesGroupComponent', () => {
  let component: VersesGroupComponent;
  let fixture: ComponentFixture<VersesGroupComponent>;

  beforeEach(async(() => {
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
