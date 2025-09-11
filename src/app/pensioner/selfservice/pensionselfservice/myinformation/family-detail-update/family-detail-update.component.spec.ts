import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FamilyDetailUpdateComponent } from './family-detail-update.component';

describe('FamilyDetailUpdateComponent', () => {
  let component: FamilyDetailUpdateComponent;
  let fixture: ComponentFixture<FamilyDetailUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamilyDetailUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyDetailUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});




