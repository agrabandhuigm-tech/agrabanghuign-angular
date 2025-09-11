import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceWithdrawComponent } from './advance-withdraw.component';

describe('AdvanceWithdrawComponent', () => {
  let component: AdvanceWithdrawComponent;
  let fixture: ComponentFixture<AdvanceWithdrawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceWithdrawComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
