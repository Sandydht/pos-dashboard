import { Component, computed, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  imports: [],
  templateUrl: './textarea.html',
  styleUrl: './textarea.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
})
export class TextareaComponent implements ControlValueAccessor {
  id = input<string>('');
  label = input<string>('');
  required = input<boolean>(false);
  placeholder = input<string>('Input...');
  disabled = input<boolean>(false);
  error = input<string>('');

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

  textareaClasses = computed(() => {
    const baseStyle =
      'w-full h-auto min-h-[120px] border p-4 rounded-lg text-left text-[12px] leading-[16px] outline-none resize-none';
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

  isDisabled = computed(() => this.disabled() || this.disabledSignal());
}
