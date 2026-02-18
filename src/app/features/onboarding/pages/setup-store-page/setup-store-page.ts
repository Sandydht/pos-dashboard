import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { InputComponent } from '../../../../shared/components/input/input';
import { ButtonComponent } from '../../../../shared/components/button/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { getFormErrorMessage } from '../../../../shared/utils/form-error';
import { AuthService } from '../../../../core/services/auth-service/auth-service';
import { CreateStoreRequest } from '../../../store/models/create-store-request.model';
import { StoreService } from '../../../../core/services/store-service/store-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '../../../store/models/store.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setup-store-page',
  imports: [CommonModule, InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './setup-store-page.html',
  styleUrl: './setup-store-page.css',
})
export class SetupStorePage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly storeService = inject(StoreService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  setupStoreForm = this.formBuilder.nonNullable.group({
    photoUrl: [null],
    storeCode: [{ value: '', disabled: true }, [Validators.required]],
    storeName: ['', [Validators.required]],
  });

  submitSetupStoreLoading = signal<boolean>(false);

  constructor() {
    this.setupStoreForm.controls.storeCode.disable();
    this.setListenStoreName();
  }

  get storeCodeError(): string {
    return getFormErrorMessage(this.setupStoreForm.controls.storeCode, {
      required: 'Name is required',
    });
  }

  get storeNameError(): string {
    return getFormErrorMessage(this.setupStoreForm.controls.storeName, {
      required: 'Name is required',
    });
  }

  setListenStoreName(): void {
    this.setupStoreForm.controls.storeName.valueChanges.subscribe((value) => {
      const code = this.generateStoreCode(value);

      this.setupStoreForm.controls.storeCode.setValue(code, {
        emitEvent: false,
      });
    });
  }

  generateStoreCode(storeName: string): string {
    if (!storeName) return '';

    return storeName
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 20);
  }

  onSubmit(): void {
    if (this.setupStoreForm.invalid) {
      this.setupStoreForm.markAllAsTouched();
      return;
    }

    if (!this.authService.userId()) {
      return;
    }

    this.submitSetupStoreLoading.set(true);
    const payload: CreateStoreRequest = {
      photoUrl: this.setupStoreForm.controls.photoUrl.value,
      code: this.setupStoreForm.controls.storeCode.value,
      name: this.setupStoreForm.controls.storeName.value,
      ownerId: this.authService.userId(),
    };

    this.storeService
      .createStore(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: Store | null) => {
          if (response?.id) {
            this.setupStoreForm.reset();
            this.router.navigate(['onboarding', 'setup-product-and-catalog']);
          }

          this.submitSetupStoreLoading.set(false);
        },
        error: () => {
          this.submitSetupStoreLoading.set(false);
        },
      });
  }
}
