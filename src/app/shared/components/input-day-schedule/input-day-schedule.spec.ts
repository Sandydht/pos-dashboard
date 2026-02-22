import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDayScheduleComponent } from './input-day-schedule';

describe('InputDayScheduleComponent', () => {
  let component: InputDayScheduleComponent;
  let fixture: ComponentFixture<InputDayScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputDayScheduleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputDayScheduleComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
