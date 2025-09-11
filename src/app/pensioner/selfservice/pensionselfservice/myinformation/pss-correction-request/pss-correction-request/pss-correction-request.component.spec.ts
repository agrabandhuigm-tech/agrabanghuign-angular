import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PssCorrectionRequestComponent } from './pss-correction-request.component';

describe('PssCorrectionRequestComponent', () => {
  let component: PssCorrectionRequestComponent;
  let fixture: ComponentFixture<PssCorrectionRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PssCorrectionRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PssCorrectionRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
