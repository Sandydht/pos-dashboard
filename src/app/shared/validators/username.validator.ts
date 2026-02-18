import { AbstractControl, ValidationErrors } from '@angular/forms';

export const usernameValidator = (control: AbstractControl): ValidationErrors | null => {
  const value: string = control.value;

  if (!value) return null;

  const maxLength = value.length > 50;
  const containRestrictedCharacter = /^[\w]+$/.test(value);

  const errors: ValidationErrors = {};

  if (maxLength) errors['maxLength'] = true;
  if (!containRestrictedCharacter) errors['containRestrictedCharacter'] = true;

  return Object.keys(errors).length ? errors : null;
};
