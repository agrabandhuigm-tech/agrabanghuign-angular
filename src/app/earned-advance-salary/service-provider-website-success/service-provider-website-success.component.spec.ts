import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceProviderWebsiteSuccessComponent } from './service-provider-website-success.component';

describe('AdvanceSalaryComponent', () => {
  let component: ServiceProviderWebsiteSuccessComponent;
  let fixture: ComponentFixture<ServiceProviderWebsiteSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceProviderWebsiteSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceProviderWebsiteSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
