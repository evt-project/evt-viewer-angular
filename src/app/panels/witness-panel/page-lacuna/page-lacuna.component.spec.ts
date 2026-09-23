import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLacunaComponent } from './page-lacuna.component';

describe('PageLacunaComponent', () => {
  let component: PageLacunaComponent;
  let fixture: ComponentFixture<PageLacunaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageLacunaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageLacunaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
