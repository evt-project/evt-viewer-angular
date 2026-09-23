import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadingMetadataComponent } from './reading-metadata.component';

describe('ReadingMetadataComponent', () => {
  let component: ReadingMetadataComponent;
  let fixture: ComponentFixture<ReadingMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadingMetadataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadingMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
