import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EntitiesSelectComponent } from './entities-select.component';

describe('EntitiesSelectComponent', () => {
  let component: EntitiesSelectComponent;
  let fixture: ComponentFixture<EntitiesSelectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EntitiesSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntitiesSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
