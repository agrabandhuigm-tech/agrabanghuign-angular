import { ComponentFixture, TestBed } from '@angular/core/testing';
import {TrackTransactionComponent} from './track-transaction.component'

describe('TrackTransactionComponent', () => {
  let component: TrackTransactionComponent;
  let fixture: ComponentFixture<TrackTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
