import { CommonModule } from '@angular/common';
import { Component, computed, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-toggle-switch',
  imports: [CommonModule],
  templateUrl: './toggle-switch.html',
  styleUrl: './toggle-switch.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleSwitchComponent),
      multi: true,
    },
  ],
})
export class ToggleSwitchComponent implements ControlValueAccessor {
  id = input<string>('toggle-switch');
  disabled = input<boolean>(false);

  valueChange = output<boolean>();

  internalValue = signal<boolean>(false);
  disabledSignal = signal(false);

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: boolean): void {
    this.internalValue.set(value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledSignal.set(isDisabled);
  }

  handleChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.internalValue.set(checked);
    this.valueChange.emit(checked);
    this.onChange(checked);
  }

  handleBlur(): void {
    this.onTouched();
  }

  isDisabled = computed<boolean>(() => this.disabled() || this.disabledSignal());
}
