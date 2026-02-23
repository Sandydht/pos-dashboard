import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { InputComponent } from '../../../../shared/components/input/input';
import { ButtonComponent } from '../../../../shared/components/button/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { getFormErrorMessage } from '../../../../shared/utils/form-error';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store as StoreModel } from '../../../store/models/store.model';
import { Router } from '@angular/router';
import { StepHeaderComponent } from '../../components/step-header/step-header';
import { OnboardingService } from '../../../../core/services/onboarding-service/onboarding-service';
import { OnboardingCreateStoreRequest } from '../../models/onboarding-create-store-request.model';
import { GenerateUppercaseSlugPipe } from '../../../../shared/pipes/generate-uppercase-slug-pipe/generate-uppercase-slug-pipe';
import * as SnackbarActions from '../../../../shared/components/snackbar/store/snackbar.actions';
import { Store } from '@ngrx/store';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload';
import { UploadedFile } from '../../../../shared/models/uploaded-file.model';
import { UploadService } from '../../../../core/services/upload-service/upload-service';
import { UploadRequest } from '../../../../shared/models/upload-request.model';

@Component({
  selector: 'app-setup-store-page',
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    StepHeaderComponent,
    FileUploadComponent,
  ],
  providers: [GenerateUppercaseSlugPipe],
  templateUrl: './setup-store-page.html',
  styleUrl: './setup-store-page.css',
})
export class SetupStorePage implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly onboardingService = inject(OnboardingService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly generateUppercaseSlug = inject(GenerateUppercaseSlugPipe);
  private readonly store = inject(Store);
  private readonly uploadService = inject(UploadService);

  setupStoreForm = this.formBuilder.nonNullable.group({
    storePhotoUrl: this.formBuilder.control<UploadedFile[]>([]),
    storeCode: [{ value: '', disabled: true }, [Validators.required]],
    storeName: ['', [Validators.required]],
  });

  storeData = signal<StoreModel | null>(null);
  fetchStoreDetailLoading = signal<boolean>(false);
  submitSetupStoreLoading = signal<boolean>(false);

  constructor() {
    this.setupStoreForm.controls.storeCode.disable();
    this.listenToStoreNameChanges();
  }

  get storeCodeError(): string {
    return getFormErrorMessage(this.setupStoreForm.controls.storeCode, {
      required: 'Code is required',
    });
  }

  get storeNameError(): string {
    return getFormErrorMessage(this.setupStoreForm.controls.storeName, {
      required: 'Name is required',
    });
  }

  storeId = computed<string | null>(() => this.storeData()?.id || null);

  ngOnInit(): void {
    this.fetchGetStoreDetail();
  }

  listenToStoreNameChanges(): void {
    this.setupStoreForm.controls.storeName.valueChanges.subscribe((value) => {
      const code = this.generateUppercaseSlug.transform(value);

      this.setupStoreForm.controls.storeCode.setValue(code, {
        emitEvent: false,
      });
    });
  }

  fetchGetStoreDetail(): void {
    this.fetchStoreDetailLoading.set(true);
    this.onboardingService
      .getStoreDetail()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: StoreModel) => {
          if (response.code && response.name) {
            this.setupStoreForm.setValue({
              storePhotoUrl: null,
              storeCode: response.code,
              storeName: response.name,
            });
          }

          this.storeData.set(response);
          this.fetchStoreDetailLoading.set(false);
        },
        error: (err) => {
          this.store.dispatch(
            SnackbarActions.showSnackbar({
              message: err?.error?.message || 'Internal Server Error',
              variant: 'error',
            }),
          );
          this.fetchStoreDetailLoading.set(false);
        },
      });
  }

  onSubmit(): void {
    if (this.setupStoreForm.invalid) {
      this.setupStoreForm.markAllAsTouched();
      return;
    }

    this.submitSetupStoreLoading.set(true);

    const uploadedFiles = this.setupStoreForm.controls.storePhotoUrl.value ?? [];

    const firstFile: UploadedFile | null =
      uploadedFiles.find((file: UploadedFile) => !file.error) ?? null;
    if (!firstFile) {
      this.store.dispatch(
        SnackbarActions.showSnackbar({
          message: 'No valid file selected',
          variant: 'error',
        }),
      );
      this.submitSetupStoreLoading.set(false);
      return;
    }

    if (!this.storeId()) {
      this.store.dispatch(
        SnackbarActions.showSnackbar({
          message: 'Invalid store id',
          variant: 'error',
        }),
      );
      this.submitSetupStoreLoading.set(false);
      return;
    }

    const uploadFilePayload: UploadRequest = {
      file: firstFile.file,
      context: 'store',
      entityId: this.storeId() as string,
    };

    this.uploadService
      .upload(uploadFilePayload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: string) => {
          const payload: OnboardingCreateStoreRequest = {
            photoUrl: response,
            code: this.setupStoreForm.controls.storeCode.value,
            name: this.setupStoreForm.controls.storeName.value,
          };

          this.onboardingService
            .createStore(payload)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.setupStoreForm.reset();
                this.submitSetupStoreLoading.set(false);
                this.router.navigate(['/onboarding', 'setup-outlet']);
              },
              error: (err) => {
                this.store.dispatch(
                  SnackbarActions.showSnackbar({
                    message: err?.error?.message || 'Internal Server Error',
                    variant: 'error',
                  }),
                );
                this.submitSetupStoreLoading.set(false);
              },
            });
        },
        error: (err) => {
          this.store.dispatch(
            SnackbarActions.showSnackbar({
              message: err?.error?.message || 'Internal Server Error',
              variant: 'error',
            }),
          );
          this.submitSetupStoreLoading.set(false);
        },
      });
  }
}
