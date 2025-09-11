import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensionkitissueddialogComponent } from './pensionkitissueddialog.component';

describe('PensionkitissueddialogComponent', () => {
  let component: PensionkitissueddialogComponent;
  let fixture: ComponentFixture<PensionkitissueddialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PensionkitissueddialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PensionkitissueddialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
