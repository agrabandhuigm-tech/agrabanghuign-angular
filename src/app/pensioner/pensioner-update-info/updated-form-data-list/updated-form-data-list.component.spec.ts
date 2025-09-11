import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatedFormDataListComponent } from './updated-form-data-list.component';

describe('UpdatedFormDataListComponent', () => {
  let component: UpdatedFormDataListComponent;
  let fixture: ComponentFixture<UpdatedFormDataListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatedFormDataListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatedFormDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
