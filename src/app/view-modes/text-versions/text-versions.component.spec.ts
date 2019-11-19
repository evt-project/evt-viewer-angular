import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextVersionsComponent } from './text-versions.component';

describe('TextVersionsComponent', () => {
  let component: TextVersionsComponent;
  let fixture: ComponentFixture<TextVersionsComponent>;

  beforeEach(async(() => {
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
