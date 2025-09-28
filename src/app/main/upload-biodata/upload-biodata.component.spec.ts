import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBiodataComponent } from './upload-biodata.component';

describe('UploadBiodataComponent', () => {
  let component: UploadBiodataComponent;
  let fixture: ComponentFixture<UploadBiodataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadBiodataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadBiodataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
