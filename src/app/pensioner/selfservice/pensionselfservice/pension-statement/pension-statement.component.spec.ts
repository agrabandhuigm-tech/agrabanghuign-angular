import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensionStatementComponent } from './pension-statement.component';

describe('PensionStatementComponent', () => {
  let component: PensionStatementComponent;
  let fixture: ComponentFixture<PensionStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PensionStatementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PensionStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
