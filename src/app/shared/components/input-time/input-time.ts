import { Component, computed, forwardRef, input, OnInit, output, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ClickOutsideDirective } from '../../directives/click-outside-directive/click-outside-directive';
import { generateTimeList } from '../../utils/generate-time-list.util';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-time',
  imports: [ClickOutsideDirective, CommonModule, FormsModule],
  templateUrl: './input-time.html',
  styleUrl: './input-time.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTimeComponent),
      multi: true,
    },
  ],
})
export class InputTimeComponent implements ControlValueAccessor, OnInit {
  id = input<string>('input-time');
  placeholder = input<string>('HH:mm');
  disabled = input<boolean>(false);
  error = input<string>('');

  valueChange = output<string>();

  internalValue = signal<string>('');
  disabledSignal = signal<boolean>(false);
  isOpenDropdown = signal<boolean>(false);
  times = signal<string[]>([]);

  ngOnInit(): void {
    const timeList = generateTimeList();
    this.times.set(timeList);
  }

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

  toggleDropdown(): void {
    this.isOpenDropdown.update((value) => !value);
  }

  closeDropdown(): void {
    this.isOpenDropdown.set(false);
    this.onTouched();
  }

  handleSelectItem(value: string): void {
    const time = this.times().find((time) => time === value) || null;
    this.internalValue.set(value);
    this.valueChange.emit(value);
    this.onChange(value);
    this.closeDropdown();
  }

  isDisabled = computed<boolean>(() => this.disabled() || this.disabledSignal());

  selectedInternalValue = computed<string | null>(() => {
    if (this.internalValue()) return this.internalValue();
    if (!this.internalValue()) return this.placeholder();
    return this.placeholder();
  });

  buttonClasses = computed(() => {
    const baseStyle =
      'w-full h-auto max-h-[34px] px-4 py-2 rounded-lg text-left text-[12px] leading-[16px] outline-none border overflow-hidden flex items-center justify-between gap-2';
    const normalStyle =
      'cursor-pointer text-black border-[var(--color-tertiary-500)] focus:border-[var(--color-info)] focus:ring-2 focus:ring-[var(--color-info)]';
    const placeholderStyle =
      'text-[#9E9E9E] cursor-pointer border-[var(--color-tertiary-500)] focus:border-[var(--color-info)] focus:ring-2 focus:ring-[var(--color-info)]';
    const disabledStyle =
      'bg-[var(--state-disabled-bg)] cursor-not-allowed opacity-[var(--state-disabled-opacity)]';
    const errorStyle =
      'cursor-pointer border-[var(--color-error)] focus:border-[var(--color-error-dark)] focus:ring-2 focus:ring-[var(--color-error-light)]';

    if (this.isDisabled()) return `${baseStyle} ${disabledStyle}`;
    if (this.error()) return `${baseStyle} ${errorStyle}`;
    if (this.placeholder() && !this.internalValue()) return `${baseStyle} ${placeholderStyle}`;

    return `${baseStyle} ${normalStyle}`;
  });
}
