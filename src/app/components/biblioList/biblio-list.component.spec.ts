import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiblioListComponent } from './biblio-list.component';

describe('BiblioListComponent', () => {
  let component: BiblioListComponent;
  let fixture: ComponentFixture<BiblioListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiblioListComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiblioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
