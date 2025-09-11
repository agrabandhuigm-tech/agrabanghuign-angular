import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnauthorizedUserDialogComponent } from './unauthorized-user-dialog.component';

describe('UnauthorizedUserDialogComponent', () => {
  let component: UnauthorizedUserDialogComponent;
  let fixture: ComponentFixture<UnauthorizedUserDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnauthorizedUserDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnauthorizedUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
