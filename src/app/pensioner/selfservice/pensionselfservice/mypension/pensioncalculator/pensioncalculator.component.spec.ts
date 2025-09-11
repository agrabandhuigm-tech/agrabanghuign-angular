import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensioncalculatorComponent } from './pensioncalculator.component';

describe('PensioncalculatorComponent', () => {
  let component: PensioncalculatorComponent;
  let fixture: ComponentFixture<PensioncalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PensioncalculatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PensioncalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
