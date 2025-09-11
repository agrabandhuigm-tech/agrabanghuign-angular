import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensionerFinancialYearStatusComponent } from './pensioner-financial-year-status.component';

describe('PensionerFinancialYearStatusComponent', () => {
  let component: PensionerFinancialYearStatusComponent;
  let fixture: ComponentFixture<PensionerFinancialYearStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PensionerFinancialYearStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PensionerFinancialYearStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
