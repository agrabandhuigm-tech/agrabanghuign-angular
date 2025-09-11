import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarnedAdvanceSalaryComponent } from './earned-advance-salary.component';

describe('EarnedAdvanceSalaryComponent', () => {
  let component: EarnedAdvanceSalaryComponent;
  let fixture: ComponentFixture<EarnedAdvanceSalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarnedAdvanceSalaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EarnedAdvanceSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
