import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WitnessRespMetadataComponent } from './witness-resp-metadata.component';

describe('WitnessRespMetadataComponent', () => {
  let component: WitnessRespMetadataComponent;
  let fixture: ComponentFixture<WitnessRespMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WitnessRespMetadataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WitnessRespMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
