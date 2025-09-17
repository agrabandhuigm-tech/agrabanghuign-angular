import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutMaharajComponent } from './about-maharaj.component';

describe('AboutMaharajComponent', () => {
  let component: AboutMaharajComponent;
  let fixture: ComponentFixture<AboutMaharajComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutMaharajComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutMaharajComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
