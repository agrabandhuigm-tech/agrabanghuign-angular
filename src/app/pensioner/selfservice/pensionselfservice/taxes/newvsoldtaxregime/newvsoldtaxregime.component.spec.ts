import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewvsoldtaxregimeComponent } from './newvsoldtaxregime.component';

describe('NewvsoldtaxregimeComponent', () => {
  let component: NewvsoldtaxregimeComponent;
  let fixture: ComponentFixture<NewvsoldtaxregimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewvsoldtaxregimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewvsoldtaxregimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
