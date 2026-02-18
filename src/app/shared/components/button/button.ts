import { Component, computed, input } from '@angular/core';
import { ButtonVariant } from '../../models/button-variant.model';
import { ButtonType } from '../../models/button-type.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class ButtonComponent {
  id = input<string>('');
  variant = input<ButtonVariant>('primary');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  type = input<ButtonType>('button');

  classes = computed(() => {
    const base =
      'w-full h-auto px-4 py-2 rounded-full transition-all text-center text-[12px] leading-[16px] font-semibold flex items-center justify-center gap-2 focus:border-[var(--color-info)] focus:ring-2 focus:ring-[var(--color-info)] outline-none';

    const variants: Record<ButtonVariant, string> = {
      primary:
        'bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)] cursor-pointer',
      secondary:
        'bg-[var(--color-secondary-500)] text-white hover:bg-[var(--color-secondary-600)] cursor-pointer',
      tertiary:
        'bg-[var(--color-tertiary-500)] text-white hover:bg-[var(--color-tertiary-600)] cursor-pointer',
      quaternary:
        'bg-[var(--color-quaternary-200)] text-white hover:bg-[var(--color-quaternary-300)] cursor-pointer',
      danger:
        'bg-[var(--color-error)] text-white hover:bg-[var(--color-error-dark)] cursor-pointer',
      'outline-primary':
        'border-2 border-[var(--color-primary-500)] text-[var(--color-primary-500)] hover:bg-gray-100 cursor-pointer',
      'outline-secondary':
        'border-2 border-[var(--color-secondary-500)] text-[var(--color-secondary-500)] hover:bg-gray-100 cursor-pointer',
      'outline-tertiary':
        'border-2 border-[var(--color-tertiary-500)] text-[var(--color-tertiary-500)] hover:bg-gray-100 cursor-pointer',
      'outline-quaternary':
        'border-2 border-[var(--color-quaternary-300)] text-[var(--color-quaternary-300)] hover:bg-gray-100 cursor-pointer',
      'outline-danger':
        'border-2 border-[var(--color-error)] text-[var(--color-error)] hover:bg-gray-100 cursor-pointer',
    };

    const disabledStyle = 'bg-[var(--state-disabled-bg)] cursor-not-allowed text-[#FFFFFF]';

    if (this.disabled() || this.loading()) return `${base} ${disabledStyle}`;

    return `${base} ${variants[this.variant()]}`;
  });
}
