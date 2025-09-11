import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncometaxcalculatorComponent } from './incometaxcalculator.component';

describe('IncometaxcalculatorComponent', () => {
  let component: IncometaxcalculatorComponent;
  let fixture: ComponentFixture<IncometaxcalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncometaxcalculatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncometaxcalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
