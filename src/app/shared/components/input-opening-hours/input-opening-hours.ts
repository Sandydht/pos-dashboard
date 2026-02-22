import { CommonModule } from '@angular/common';
import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OpeningHours } from '../../../features/outlet/models/opening-hours.model';
import { InputDayScheduleComponent } from '../input-day-schedule/input-day-schedule';
import { DaySchedule } from '../../../features/outlet/models/day-schedule.model';

@Component({
  selector: 'app-input-opening-hours',
  imports: [CommonModule, InputDayScheduleComponent, FormsModule],
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
  error = input<string>('');

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
  private onTouched: () => void = () => {};

  writeValue(value: OpeningHours | null): void {
    this.internalValue.set({
      monday: value?.monday ?? { open: '', close: '', isClosed: false },
      tuesday: value?.tuesday ?? { open: '', close: '', isClosed: false },
      wednesday: value?.wednesday ?? { open: '', close: '', isClosed: false },
      thursday: value?.thursday ?? { open: '', close: '', isClosed: false },
      friday: value?.friday ?? { open: '', close: '', isClosed: false },
      saturday: value?.saturday ?? { open: '', close: '', isClosed: false },
      sunday: value?.sunday ?? { open: '', close: '', isClosed: false },
    });
  }

  registerOnChange(fn: (value: OpeningHours) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledSignal.set(isDisabled);
  }

  handleDayChange(dayKey: string, value: DaySchedule): void {
    this.internalValue.update((current) => ({
      ...current,
      [dayKey]: value,
    }));

    this.onChange(this.internalValue());
    this.onTouched();
  }

  isDisabled = computed(() => this.disabled() || this.disabledSignal());
}
