import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TextVersionsComponent } from './text-versions.component';

describe('TextVersionsComponent', () => {
  let component: TextVersionsComponent;
  let fixture: ComponentFixture<TextVersionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TextVersionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
