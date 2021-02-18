import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationStmtComponent } from './publication-stmt.component';

describe('PublicationStmtComponent', () => {
  let component: PublicationStmtComponent;
  let fixture: ComponentFixture<PublicationStmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicationStmtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicationStmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
