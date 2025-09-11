import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeOtherCertificatesComponent } from './life-other-certificates.component';

describe('LifeOtherCertificatesComponent', () => {
  let component: LifeOtherCertificatesComponent;
  let fixture: ComponentFixture<LifeOtherCertificatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LifeOtherCertificatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeOtherCertificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
