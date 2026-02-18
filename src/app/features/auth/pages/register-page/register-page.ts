import { Component, inject, signal } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button/button';
import { InputComponent } from '../../../../shared/components/input/input';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterRequest } from '../../models/register-request.model';
import { InputPasswordComponent } from '../../../../shared/components/input-password/input-password';
import { getFormErrorMessage } from '../../../../shared/utils/form-error';
import { strongPasswordValidator } from '../../../../shared/validators/strong-password.validator';
import { usernameValidator } from '../../../../shared/validators/username.validator';
import { indonesianPhoneNumberValidator } from '../../../../shared/validators/indonesian-phone-number.validator';
import { AuthService } from '../../../../core/services/auth-service/auth-service';
import { RegisterResponse } from '../../models/register-response.model';

@Component({
  selector: 'app-register-page',
  imports: [
    ButtonComponent,
    InputComponent,
    CommonModule,
    ReactiveFormsModule,
    InputPasswordComponent,
  ],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  registerForm = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required, usernameValidator]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, indonesianPhoneNumberValidator]],
    fullName: ['', [Validators.required]],
    password: ['', [Validators.required, strongPasswordValidator]],
  });

  submitRegisterLoading = signal<boolean>(false);

  get usernameError(): string {
    return getFormErrorMessage(this.registerForm.controls.username, {
      required: 'Username is required',
      maxLength: 'Username must be maximum 50 characters',
      containRestrictedCharacter: 'Username contains restricted character',
    });
  }

  get emailError(): string {
    return getFormErrorMessage(this.registerForm.controls.email, {
      required: 'Email is required',
      email: 'Email is invalid format',
    });
  }

  get phoneNumberError(): string {
    return getFormErrorMessage(this.registerForm.controls.phoneNumber, {
      required: 'Phone Number is required',
      isIndonesianPhoneNumber: 'Phone Number must be a valid Indonesian number (08xxx or +62xxx)',
    });
  }

  get fullNameError(): string {
    return getFormErrorMessage(this.registerForm.controls.fullName, {
      required: 'Full Name is required',
    });
  }

  get passwordError(): string {
    return getFormErrorMessage(this.registerForm.controls.password, {
      required: 'Password is required',
      minLength: 'Password must be at least 8 characters',
      upperCase: 'Password must contain at least 1 uppercase letter',
      lowerCase: 'Password must contain at least 1 lowercase letter',
      number: 'Password must contain at least 1 number',
      symbol: 'Password must contain at least 1 special character',
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.submitRegisterLoading.set(true);

    const payload: RegisterRequest = {
      username: this.registerForm.controls.username.value,
      email: this.registerForm.controls.email.value,
      phoneNumber: this.registerForm.controls.phoneNumber.value,
      fullName: this.registerForm.controls.fullName.value,
      password: this.registerForm.controls.password.value,
    };

    this.authService.register(payload).subscribe({
      next: (response: RegisterResponse) => {
        if (response.id) {
          this.submitRegisterLoading.set(false);
        }
      },
      error: () => {
        this.submitRegisterLoading.set(false);
      },
    });
  }
}
