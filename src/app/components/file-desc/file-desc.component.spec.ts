import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDescComponent } from './file-desc.component';

describe('FileDescComponent', () => {
  let component: FileDescComponent;
  let fixture: ComponentFixture<FileDescComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ FileDescComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
