import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MypensionComponent } from './mypension.component';

describe('MypensionComponent', () => {
  let component: MypensionComponent;
  let fixture: ComponentFixture<MypensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MypensionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MypensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
