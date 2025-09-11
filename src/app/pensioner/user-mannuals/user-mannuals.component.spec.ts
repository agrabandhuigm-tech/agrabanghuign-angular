import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMannualsComponent } from './user-mannuals.component';

describe('UserMannualsComponent', () => {
  let component: UserMannualsComponent;
  let fixture: ComponentFixture<UserMannualsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserMannualsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMannualsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
