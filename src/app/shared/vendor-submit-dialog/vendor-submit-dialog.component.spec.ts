import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSubmitDialogComponent } from './vendor-submit-dialog.component';

describe('VendorSubmitDialogComponent', () => {
  let component: VendorSubmitDialogComponent;
  let fixture: ComponentFixture<VendorSubmitDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorSubmitDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorSubmitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
