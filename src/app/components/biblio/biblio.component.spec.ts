import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiblioEntryComponent } from './biblio.component';

describe('BiblioComponent', () => {
  let component: BiblioEntryComponent;
  let fixture: ComponentFixture<BiblioEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiblioEntryComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiblioEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
