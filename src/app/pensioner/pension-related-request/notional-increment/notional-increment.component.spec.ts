import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotionalIncrementComponent } from './notional-increment.component';

describe('NotionalIncrementComponent', () => {
  let component: NotionalIncrementComponent;
  let fixture: ComponentFixture<NotionalIncrementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotionalIncrementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotionalIncrementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
