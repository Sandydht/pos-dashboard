import { CommonModule } from '@angular/common';
import { Component, computed, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-password',
  imports: [CommonModule],
  templateUrl: './input-password.html',
  styleUrl: './input-password.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputPasswordComponent),
      multi: true,
    },
  ],
})
export class InputPasswordComponent implements ControlValueAccessor {
  id = input<string>('input-component');
  label = input<string>('Label');
  required = input<boolean>(false);
  placeholder = input<string>('Input...');
  disabled = input<boolean>(false);
  error = input<string>('');

  valueChange = output<string>();

  internalValue = signal<string>('');
  isShowPassword = signal<boolean>(false);
  disabledSignal = signal(false);

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.internalValue.set(value);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
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
    this.onTouched();
  }

  toggleShowPassword(): void {
    this.isShowPassword.update((value) => !value);
  }

  inputType = computed(() => (this.isShowPassword() ? 'text' : 'password'));

  inputClasses = computed(() => {
    const baseStyle =
      'w-full h-auto border pl-4 py-2 pr-12 rounded-lg text-left text-[12px] leading-[16px] outline-none';
    const normalStyle =
      'text-black border-[var(--color-tertiary-500)] focus:border-[var(--color-info)] focus:ring-2 focus:ring-[var(--color-info)]';
    const disabledStyle =
      'bg-[var(--state-disabled-bg)] cursor-not-allowed opacity-[var(--state-disabled-opacity)]';
    const errorStyle =
      'border-[var(--color-error)] focus:border-[var(--color-error-dark)] focus:ring-2 focus:ring-[var(--color-error-light)]';

    if (this.isDisabled()) return `${baseStyle} ${disabledStyle}`;
    if (this.error()) return `${baseStyle} ${errorStyle}`;

    return `${baseStyle} ${normalStyle}`;
  });

  eyeButtonClasses = computed(() => {
    const baseStyle =
      'absolute right-4 top-1/2 -translate-y-1/2 w-full h-full aspect-square max-w-[32px] max-h-[32px] flex items-center justify-center';
    const normalStyle = 'cursor-pointer';
    const disabledStyle = 'cursor-not-allowed';

    if (this.isDisabled()) return `${baseStyle} ${disabledStyle}`;

    return `${baseStyle} ${normalStyle}`;
  });

  isDisabled = computed(() => this.disabled() || this.disabledSignal());
}
