import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsIdentifierComponent } from './ms-identifier.component';

describe('MsIdentifierComponent', () => {
  let component: MsIdentifierComponent;
  let fixture: ComponentFixture<MsIdentifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsIdentifierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsIdentifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
