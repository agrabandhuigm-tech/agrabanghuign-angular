import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyinformationComponent } from './myinformation.component';

describe('MyinformationComponent', () => {
  let component: MyinformationComponent;
  let fixture: ComponentFixture<MyinformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyinformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyinformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
