import { Component, computed, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-search',
  imports: [],
  templateUrl: './input-search.html',
  styleUrl: './input-search.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSearchComponent),
      multi: true,
    },
  ],
})
export class InputSearchComponent implements ControlValueAccessor {
  id = input<string>('input-component');
  placeholder = input<string>('Input...');
  disabled = input<boolean>(false);

  valueChange = output<string>();

  internalValue = signal<string>('');
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

  inputClasses = computed(() => {
    const baseStyle =
      'w-full h-auto border pl-12 pr-4 py-2 rounded-lg text-left text-[12px] leading-[16px] outline-none';
    const normalStyle =
      'text-black border-[var(--color-tertiary-500)] focus:border-[var(--color-info)] focus:ring-2 focus:ring-[var(--color-info)]';
    const disabledStyle =
      'bg-[var(--state-disabled-bg)] cursor-not-allowed opacity-[var(--state-disabled-opacity)]';

    if (this.isDisabled()) return `${baseStyle} ${disabledStyle}`;

    return `${baseStyle} ${normalStyle}`;
  });

  isDisabled = computed(() => this.disabled() || this.disabledSignal());
}
