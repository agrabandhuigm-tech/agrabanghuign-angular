import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensionerUpdateInfoComponent } from './pensioner-update-info.component';

describe('PensionerUpdateInfoComponent', () => {
  let component: PensionerUpdateInfoComponent;
  let fixture: ComponentFixture<PensionerUpdateInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PensionerUpdateInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PensionerUpdateInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
