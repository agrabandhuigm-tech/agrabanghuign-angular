import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensionstatementComponent } from './pensionstatement.component';

describe('PensionstatementComponent', () => {
  let component: PensionstatementComponent;
  let fixture: ComponentFixture<PensionstatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PensionstatementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PensionstatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
