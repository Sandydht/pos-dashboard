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

  valueChange = output<string>();

  internalValue = signal<string>('');
  disabledSignal = signal(false);

  private onChange: (value: string) => void = () => {};
  private onTouches: () => void = () => {};

  writeValue(value: string): void {
    this.internalValue.set(value);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouches = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledSignal.set(isDisabled);
  }

  handleInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.internalValue.set(val);
    this.valueChange.emit(val);
    this.onChange(val);
  }

  handleBlur(): void {
    this.onTouches();
  }

  isDisabled = computed<boolean>(() => this.disabled() || this.disabledSignal());
}
