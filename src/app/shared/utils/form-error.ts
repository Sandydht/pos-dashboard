import { AbstractControl } from '@angular/forms';

export const getFormErrorMessage = (
  control: AbstractControl | null,
  messages: Record<string, string>,
): string => {
  if (!control || !control.touched) return '';

  for (const errorKey of Object.keys(messages)) {
    if (control.hasError(errorKey)) {
      return messages[errorKey];
    }
  }

  return '';
};
