import { AbstractControl, ValidationErrors } from '@angular/forms';

export const indonesianPhoneNumberValidator = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value: string = control.value;

  if (!value) return null;

  const phone = value.replace(/[\s-]/g, '');
  const regex = /^(?:\+62|62|08)[0-9]{8,11}$/;
  const isIndonesianPhoneNumber = regex.test(phone);

  const errors: ValidationErrors = {};

  if (!isIndonesianPhoneNumber) errors['isIndonesianPhoneNumber'] = true;

  return Object.keys(errors).length ? errors : null;
};
