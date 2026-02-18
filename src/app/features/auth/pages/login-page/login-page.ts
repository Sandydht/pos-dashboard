import { Component, DestroyRef, inject, signal } from '@angular/core';
import { InputComponent } from '../../../../shared/components/input/input';
import { CommonModule } from '@angular/common';
import { InputPasswordComponent } from '../../../../shared/components/input-password/input-password';
import { ButtonComponent } from '../../../../shared/components/button/button';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { strongPasswordValidator } from '../../../../shared/validators/strong-password.validator';
import { getFormErrorMessage } from '../../../../shared/utils/form-error';
import { AuthService } from '../../../../core/services/auth-service/auth-service';
import { LoginRequest } from '../../models/login-request.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoginResponse } from '../../models/login-response.model';

@Component({
  selector: 'app-login-page',
  imports: [
    CommonModule,
    InputComponent,
    InputPasswordComponent,
    ButtonComponent,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  submitLoginLoading = signal<boolean>(false);

  loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, strongPasswordValidator]],
    rememberMe: [false],
  });

  get emailError(): string {
    return getFormErrorMessage(this.loginForm.controls.email, {
      required: 'Email is required',
      email: 'Email is invalid format',
    });
  }

  get passwordError(): string {
    return getFormErrorMessage(this.loginForm.controls.password, {
      required: 'Password is required',
      minLength: 'Password must be at least 8 characters',
      upperCase: 'Password must contain at least 1 uppercase letter',
      lowerCase: 'Password must contain at least 1 lowercase letter',
      number: 'Password must contain at least 1 number',
      symbol: 'Password must contain at least 1 special character',
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.submitLoginLoading.set(true);

    const payload: LoginRequest = {
      email: this.loginForm.controls.email.value,
      password: this.loginForm.controls.password.value,
      rememberMe: this.loginForm.controls.rememberMe.value,
    };

    this.authService
      .login(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: LoginResponse) => {
          if (response.accessToken) {
            this.loginForm.reset();
            this.submitLoginLoading.set(false);
            this.router.navigate(['']);
          }
        },
        error: () => {
          this.submitLoginLoading.set(false);
        },
      });
  }
}
