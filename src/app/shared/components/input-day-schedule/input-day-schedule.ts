import { Component, computed, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DaySchedule } from '../../../features/outlet/models/day-schedule.model';
import { CommonModule } from '@angular/common';
import { ToggleSwitchComponent } from '../toggle-switch/toggle-switch';
import { InputTimeComponent } from '../input-time/input-time';

@Component({
  selector: 'app-input-day-schedule',
  imports: [CommonModule, ToggleSwitchComponent, InputTimeComponent],
  templateUrl: './input-day-schedule.html',
  styleUrl: './input-day-schedule.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDayScheduleComponent),
      multi: true,
    },
  ],
})
export class InputDayScheduleComponent implements ControlValueAccessor {
  id = input<string>('input-day-schedule');
  label = input<string>('');
  disabled = input<boolean>(false);

  valueChange = output<string>();

  internalValue = signal<DaySchedule>({
    open: '',
    close: '',
    isClosed: false,
  });
  disabledSignal = signal(false);

  private onChange: (value: DaySchedule) => void = () => {};
  private onTouches: () => void = () => {};

  writeValue(value: DaySchedule): void {
    this.internalValue.set(value);
  }

  registerOnChange(fn: (value: DaySchedule) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouches = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledSignal.set(isDisabled);
  }

  isDisabled = computed<boolean>(() => this.disabled() || this.disabledSignal());
}
