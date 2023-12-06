import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChangeLayerSelectorComponent } from './change-layer-selector.component';

describe('ChangeLayerSelectorComponent', () => {
  let component: ChangeLayerSelectorComponent;
  let fixture: ComponentFixture<ChangeLayerSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeLayerSelectorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeLayerSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
