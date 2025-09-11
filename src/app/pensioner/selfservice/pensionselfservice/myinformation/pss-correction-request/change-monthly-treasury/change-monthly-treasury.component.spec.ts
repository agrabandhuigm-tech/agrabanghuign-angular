import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeMonthlyTreasuryComponent } from './change-monthly-treasury.component';

describe('ChangeMonthlyTreasuryComponent', () => {
  let component: ChangeMonthlyTreasuryComponent;
  let fixture: ComponentFixture<ChangeMonthlyTreasuryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeMonthlyTreasuryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeMonthlyTreasuryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
