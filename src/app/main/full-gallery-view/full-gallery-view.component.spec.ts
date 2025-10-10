import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullGalleryViewComponent } from './full-gallery-view.component';

describe('FullGalleryViewComponent', () => {
  let component: FullGalleryViewComponent;
  let fixture: ComponentFixture<FullGalleryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullGalleryViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullGalleryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
