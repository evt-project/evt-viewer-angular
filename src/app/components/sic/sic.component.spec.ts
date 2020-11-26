import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SicComponent } from './sic.component';

describe('SicComponent', () => {
  let component: SicComponent;
  let fixture: ComponentFixture<SicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
