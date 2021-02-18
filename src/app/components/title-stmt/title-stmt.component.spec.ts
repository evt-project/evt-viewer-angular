import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleStmtComponent } from './title-stmt.component';

describe('TitleStmtComponent', () => {
  let component: TitleStmtComponent;
  let fixture: ComponentFixture<TitleStmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TitleStmtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleStmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
