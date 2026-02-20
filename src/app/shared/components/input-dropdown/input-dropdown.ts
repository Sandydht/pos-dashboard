import { CommonModule } from '@angular/common';
import { Component, computed, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputDropdownOption } from '../../models/input-dropdown-option.model';

@Component({
  selector: 'app-input-dropdown',
  imports: [CommonModule],
  templateUrl: './input-dropdown.html',
  styleUrl: './input-dropdown.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDropdownComponent),
      multi: true,
    },
  ],
})
export class InputDropdownComponent implements ControlValueAccessor {
  id = input<string>('input-component');
  label = input<string>('Label');
  required = input<boolean>(false);
  placeholder = input<string>('Input...');
  disabled = input<boolean>(false);
  error = input<string>('');
  options = input<InputDropdownOption[]>([]);

  valueChange = output<string>();

  internalValue = signal<string>('');
  disabledSignal = signal(false);
  isOpenDropdown = signal<boolean>(false);

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

  toggleDropdown(): void {
    this.isOpenDropdown.update((value) => !value);
  }

  closeDropdown(): void {
    this.isOpenDropdown.set(false);
    this.onTouches();
  }

  handleSelectItem(value: string): void {
    this.internalValue.set(value);
    this.onChange(value);
    this.closeDropdown();
  }

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
      'border-[var(--color-error)] focus:border-[var(--color-error-dark)] focus:ring-2 focus:ring-[var(--color-error-light)]';

    if (this.isDisabled()) return `${baseStyle} ${disabledStyle}`;
    if (this.error()) return `${baseStyle} ${errorStyle}`;
    if (this.placeholder()) return `${baseStyle} ${placeholderStyle}`;

    return `${baseStyle} ${normalStyle}`;
  });

  iconClasses = computed(() => {
    const baseStyle =
      'w-full h-full aspect-square min-w-[20px] max-w-[20px] min-h-[20px] max-h-[20px] transition-all';
    const openDropdownStyle = 'rotate-180';

    if (this.isOpenDropdown()) return `${baseStyle} ${openDropdownStyle}`;

    return `${baseStyle}`;
  });

  isDisabled = computed(() => this.disabled() || this.disabledSignal());

  selectedInternalValue = computed(() => {
    if (!this.internalValue()) return this.placeholder();

    const findOption = this.options().find(
      (option: InputDropdownOption) => option.key === this.internalValue(),
    );
    if (!findOption) return this.placeholder();

    return findOption;
  });
}
