import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WitnessMetadataComponent } from './witness-metadata.component';

describe('WitnessMetadataComponent', () => {
  let component: WitnessMetadataComponent;
  let fixture: ComponentFixture<WitnessMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WitnessMetadataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WitnessMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
