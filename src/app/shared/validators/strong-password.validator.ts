import { AbstractControl, ValidationErrors } from '@angular/forms';

export const strongPasswordValidator = (control: AbstractControl): ValidationErrors | null => {
  const value: string = control.value;

  if (!value) return null;

  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSymbol = /[^A-Za-z0-9]/.test(value);
  const minLength = value.length >= 8;

  const errors: ValidationErrors = {};

  if (!minLength) errors['minLength'] = true;
  if (!hasUpperCase) errors['upperCase'] = true;
  if (!hasLowerCase) errors['lowerCase'] = true;
  if (!hasNumber) errors['number'] = true;
  if (!hasSymbol) errors['symbol'] = true;

  return Object.keys(errors).length ? errors : null;
};
