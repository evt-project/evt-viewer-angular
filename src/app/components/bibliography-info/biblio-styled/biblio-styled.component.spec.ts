import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StyledBiblioEntryComponent } from './biblio-styled.component';

describe('StyledBiblioEntryComponent', () => {
  let component: StyledBiblioEntryComponent;
  let fixture: ComponentFixture<StyledBiblioEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StyledBiblioEntryComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StyledBiblioEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
