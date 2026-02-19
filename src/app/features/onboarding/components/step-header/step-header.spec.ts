import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepHeaderComponent } from './step-header';

describe('StepHeaderComponent', () => {
  let component: StepHeaderComponent;
  let fixture: ComponentFixture<StepHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StepHeaderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
