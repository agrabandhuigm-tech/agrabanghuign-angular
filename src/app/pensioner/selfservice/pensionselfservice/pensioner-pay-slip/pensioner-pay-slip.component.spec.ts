import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensionerPaySlipComponent } from './pensioner-pay-slip.component';

describe('PensionerPaySlipComponent', () => {
  let component: PensionerPaySlipComponent;
  let fixture: ComponentFixture<PensionerPaySlipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PensionerPaySlipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PensionerPaySlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
