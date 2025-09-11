import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PssDashboardComponent } from './pss-dashboard.component';

describe('PssDashboardComponent', () => {
  let component: PssDashboardComponent;
  let fixture: ComponentFixture<PssDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PssDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PssDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
