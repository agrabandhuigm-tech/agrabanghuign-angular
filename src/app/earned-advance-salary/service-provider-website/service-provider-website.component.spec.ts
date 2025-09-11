import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceProviderWebsiteComponent } from './service-provider-website.component';

describe('AdvanceSalaryComponent', () => {
  let component: ServiceProviderWebsiteComponent;
  let fixture: ComponentFixture<ServiceProviderWebsiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceProviderWebsiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceProviderWebsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
