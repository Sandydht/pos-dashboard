import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputOpeningHoursComponent } from './input-opening-hours';

describe('InputOpeningHoursComponent', () => {
  let component: InputOpeningHoursComponent;
  let fixture: ComponentFixture<InputOpeningHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputOpeningHoursComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputOpeningHoursComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
