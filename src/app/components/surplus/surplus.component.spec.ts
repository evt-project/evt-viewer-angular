import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurplusComponent } from './surplus.component';

describe('SurplusComponent', () => {
  let component: SurplusComponent;
  let fixture: ComponentFixture<SurplusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurplusComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurplusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
