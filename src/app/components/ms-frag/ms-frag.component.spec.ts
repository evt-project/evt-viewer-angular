import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsFragComponent } from './ms-frag.component';

describe('MsFragComponent', () => {
  let component: MsFragComponent;
  let fixture: ComponentFixture<MsFragComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsFragComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsFragComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
