import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeProfileDetailsComponent } from './change-profile-details.component';

describe('ChangeProfileDetailsComponent', () => {
  let component: ChangeProfileDetailsComponent;
  let fixture: ComponentFixture<ChangeProfileDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeProfileDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeProfileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
