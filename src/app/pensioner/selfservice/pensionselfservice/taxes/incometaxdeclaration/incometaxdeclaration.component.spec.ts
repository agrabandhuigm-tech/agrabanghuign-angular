import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncometaxdeclarationComponent } from './incometaxdeclaration.component';

describe('IncometaxdeclarationComponent', () => {
  let component: IncometaxdeclarationComponent;
  let fixture: ComponentFixture<IncometaxdeclarationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncometaxdeclarationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncometaxdeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
