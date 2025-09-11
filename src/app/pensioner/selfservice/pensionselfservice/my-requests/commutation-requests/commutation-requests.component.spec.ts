import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommutationRequestsComponent } from './commutation-requests.component';

describe('CommutationRequestsComponent', () => {
  let component: CommutationRequestsComponent;
  let fixture: ComponentFixture<CommutationRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommutationRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommutationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
