import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentalMixedComponent } from './documental-mixed.component';

describe('DocumentalMixedComponent', () => {
  let component: DocumentalMixedComponent;
  let fixture: ComponentFixture<DocumentalMixedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentalMixedComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentalMixedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
