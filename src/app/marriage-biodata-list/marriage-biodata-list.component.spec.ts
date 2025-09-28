import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarriageBiodataListComponent } from './marriage-biodata-list.component';

describe('MarriageBiodataListComponent', () => {
  let component: MarriageBiodataListComponent;
  let fixture: ComponentFixture<MarriageBiodataListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarriageBiodataListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarriageBiodataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
