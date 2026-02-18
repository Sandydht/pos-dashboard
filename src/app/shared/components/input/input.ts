import { CommonModule } from '@angular/common';
import { Component, computed, forwardRef, input, output, signal } from '@angular/core';
import { InputType } from '../../models/input-type.model';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [CommonModule],
  templateUrl: './input.html',
  styleUrl: './input.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  id = input<string>('input-component');
  label = input<string>('Label');
  type = input<InputType>('text');
  required = input<boolean>(false);
  placeholder = input<string>('Input...');
  disabled = input<boolean>(false);
  error = input<string>('');

  valueChange = output<string>();

  internalValue = signal<string>('');

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

  handleInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.internalValue.set(val);
    this.valueChange.emit(val);
    this.onChange(val);
  }

  handleBlur(): void {
    this.onTouches();
  }

  inputClasses = computed(() => {
    const baseStyle =
      'w-full h-auto border px-4 py-2 rounded-lg text-left text-[12px] leading-[16px] outline-none';
    const normalStyle =
      'text-black border-[var(--color-tertiary-500)] focus:border-[var(--color-info)] focus:ring-2 focus:ring-[var(--color-info)]';
    const disabledStyle =
      'bg-[var(--state-disabled-bg)] cursor-not-allowed opacity-[var(--state-disabled-opacity)]';
    const errorStyle =
      'border-[var(--color-error)] focus:border-[var(--color-error-dark)] focus:ring-2 focus:ring-[var(--color-error-light)]';

    if (this.disabled()) return `${baseStyle} ${disabledStyle}`;
    if (this.error()) return `${baseStyle} ${errorStyle}`;

    return `${baseStyle} ${normalStyle}`;
  });
}
