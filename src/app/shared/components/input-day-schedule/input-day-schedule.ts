import { Component, computed, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DaySchedule } from '../../../features/outlet/models/day-schedule.model';
import { CommonModule } from '@angular/common';
import { ToggleSwitchComponent } from '../toggle-switch/toggle-switch';
import { InputTimeComponent } from '../input-time/input-time';

@Component({
  selector: 'app-input-day-schedule',
  imports: [CommonModule, ToggleSwitchComponent, InputTimeComponent, FormsModule],
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

  valueChange = output<DaySchedule>();

  internalValue = signal<DaySchedule>({
    open: '',
    close: '',
    isClosed: false,
  });
  disabledSignal = signal(false);

  private onChange: (value: DaySchedule) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: DaySchedule | null): void {
    this.internalValue.set({
      open: value?.open ?? '',
      close: value?.close ?? '',
      isClosed: value?.isClosed ?? false,
    });
  }

  registerOnChange(fn: (value: DaySchedule) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledSignal.set(isDisabled);
  }

  handleClosedChange(value: boolean) {
    this.updateValue((current) => ({
      ...current,
      isClosed: value,
      open: value ? '' : current.open,
      close: value ? '' : current.close,
    }));
  }

  handleOpenChange(value: string) {
    this.updateValue((current) => ({
      ...current,
      open: value ?? '',
    }));
  }

  handleCloseChange(value: string) {
    this.updateValue((current) => ({
      ...current,
      close: value ?? '',
    }));
  }

  private updateValue(updater: (current: DaySchedule) => DaySchedule) {
    this.internalValue.update(updater);
    this.emitChange();
    this.onTouched();
  }

  private emitChange() {
    const value = this.internalValue();
    this.onChange(value);
    this.valueChange.emit(value);
  }

  isDisabled = computed<boolean>(() => this.disabled() || this.disabledSignal());
}
