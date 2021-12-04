import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RespStmtComponent } from './resp-stmt.component';

describe('RespStmtComponent', () => {
  let component: RespStmtComponent;
  let fixture: ComponentFixture<RespStmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RespStmtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RespStmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
