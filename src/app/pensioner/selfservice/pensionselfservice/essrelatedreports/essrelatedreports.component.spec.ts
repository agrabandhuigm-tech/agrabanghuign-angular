import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssrelatedreportsComponent } from './essrelatedreports.component';

describe('EssrelatedreportsComponent', () => {
  let component: EssrelatedreportsComponent;
  let fixture: ComponentFixture<EssrelatedreportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EssrelatedreportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssrelatedreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
