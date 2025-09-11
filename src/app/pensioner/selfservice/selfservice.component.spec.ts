import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfserviceComponent } from './selfservice.component';

describe('SelfserviceComponent', () => {
  let component: SelfserviceComponent;
  let fixture: ComponentFixture<SelfserviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfserviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
