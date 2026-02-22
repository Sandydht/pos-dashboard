import { CommonModule } from '@angular/common';
import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OpeningHours } from '../../../features/outlet/models/opening-hours.model';
import { InputDayScheduleComponent } from '../input-day-schedule/input-day-schedule';

@Component({
  selector: 'app-input-opening-hours',
  imports: [CommonModule, InputDayScheduleComponent],
  templateUrl: './input-opening-hours.html',
  styleUrl: './input-opening-hours.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputOpeningHoursComponent),
      multi: true,
    },
  ],
})
export class InputOpeningHoursComponent implements ControlValueAccessor {
  id = input<string>('input-component');
  label = input<string>('Label');
  required = input<boolean>(false);
  disabled = input<boolean>(false);

  internalValue = signal<OpeningHours>({
    monday: { open: '08:00', close: '17:00', isClosed: false },
    tuesday: { open: '08:00', close: '17:00', isClosed: false },
    wednesday: { open: '08:00', close: '17:00', isClosed: false },
    thursday: { open: '08:00', close: '17:00', isClosed: false },
    friday: { open: '08:00', close: '17:00', isClosed: false },
    saturday: { open: '08:00', close: '17:00', isClosed: false },
    sunday: { open: '08:00', close: '17:00', isClosed: false },
  });
  disabledSignal = signal(false);

  private onChange: (value: OpeningHours) => void = () => {};
  private onTouches: () => void = () => {};

  writeValue(value: OpeningHours): void {
    this.internalValue.set(value);
  }

  registerOnChange(fn: (value: OpeningHours) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouches = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledSignal.set(isDisabled);
  }

  isDisabled = computed(() => this.disabled() || this.disabledSignal());
}
