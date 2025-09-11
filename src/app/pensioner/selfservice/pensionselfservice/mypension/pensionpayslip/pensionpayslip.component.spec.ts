import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensionpayslipComponent } from './pensionpayslip.component';

describe('PensionpayslipComponent', () => {
  let component: PensionpayslipComponent;
  let fixture: ComponentFixture<PensionpayslipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PensionpayslipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PensionpayslipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
