import { Component, inject, signal } from '@angular/core';
import { StepHeaderComponent } from '../../components/step-header/step-header';
import { ButtonComponent } from '../../../../shared/components/button/button';
import { Router } from '@angular/router';
import { InputComponent } from '../../../../shared/components/input/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { getFormErrorMessage } from '../../../../shared/utils/form-error';
import { TextareaComponent } from '../../../../shared/components/textarea/textarea';

@Component({
  selector: 'app-setup-product-and-catalog-page',
  imports: [
    StepHeaderComponent,
    ButtonComponent,
    InputComponent,
    ReactiveFormsModule,
    TextareaComponent,
  ],
  templateUrl: './setup-product-and-catalog-page.html',
  styleUrl: './setup-product-and-catalog-page.css',
})
export class SetupProductAndCatalogPage {
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  setupProductAndCatalogForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
  });

  submitSetupProductAndCatalogLoading = signal<boolean>(false);

  get nameError(): string {
    return getFormErrorMessage(this.setupProductAndCatalogForm.controls.name, {
      required: 'Name is required',
    });
  }

  get descriptionError(): string {
    return getFormErrorMessage(this.setupProductAndCatalogForm.controls.description, {
      required: 'Description is required',
    });
  }

  goToSetupOutletPage(): void {
    this.router.navigate(['/onboarding', 'setup-outlet']);
  }

  onSubmit(): void {
    if (!this.setupProductAndCatalogForm.invalid) {
      this.setupProductAndCatalogForm.markAllAsTouched();
      return;
    }

    this.submitSetupProductAndCatalogLoading.set(true);
    console.log('payload: ', this.setupProductAndCatalogForm.value);
    this.submitSetupProductAndCatalogLoading.set(false);
  }
}
