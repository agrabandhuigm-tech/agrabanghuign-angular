import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensionselfserviceComponent } from './pensionselfservice.component';

describe('PensionselfserviceComponent', () => {
  let component: PensionselfserviceComponent;
  let fixture: ComponentFixture<PensionselfserviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PensionselfserviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PensionselfserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
