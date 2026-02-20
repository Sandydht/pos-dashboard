import { Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../../../shared/components/input/input';
import { ButtonComponent } from '../../../../shared/components/button/button';
import { TextareaComponent } from '../../../../shared/components/textarea/textarea';
import { StepHeaderComponent } from '../../components/step-header/step-header';
import { Router } from '@angular/router';
import { OnboardingService } from '../../../../core/services/onboarding-service/onboarding-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Outlet } from '../../../outlet/models/outlet.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { indonesianPhoneNumberValidator } from '../../../../shared/validators/indonesian-phone-number.validator';
import { InputDropdownComponent } from '../../../../shared/components/input-dropdown/input-dropdown';

@Component({
  selector: 'app-setup-outlet-page',
  imports: [
    CommonModule,
    InputComponent,
    TextareaComponent,
    ButtonComponent,
    StepHeaderComponent,
    ReactiveFormsModule,
    InputDropdownComponent,
  ],
  templateUrl: './setup-outlet-page.html',
  styleUrl: './setup-outlet-page.css',
})
export class SetupOutletPage implements OnInit {
  private readonly router = inject(Router);
  private readonly onboardingService = inject(OnboardingService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  setupOutletForm = this.formBuilder.nonNullable.group({
    outletCode: [{ value: '', disabled: true }, [Validators.required]],
    outletName: ['', [Validators.required]],
    outletPhoneNumber: ['', [Validators.required, indonesianPhoneNumberValidator]],
    outletEmail: ['', [Validators.required, Validators.email]],
    outletCountry: ['', [Validators.required]],
    outletProvince: ['', [Validators.required]],
    outletCity: ['', [Validators.required]],
    outletPostalCode: ['', [Validators.required]],
    outletAddress: ['', [Validators.required]],
    outletIsActive: [true, [Validators.required]],
    outletOpeningHours: this.formBuilder.nonNullable.group({
      monday: this.createDaySchedule(),
      tuesday: this.createDaySchedule(),
      wednesday: this.createDaySchedule(),
      thursday: this.createDaySchedule(),
      friday: this.createDaySchedule(),
      saturday: this.createDaySchedule(),
      sunday: this.createDaySchedule(),
    }),
  });

  fetchGetOutletDetailLoading = signal<boolean>(false);
  submitSetupOutletLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.fetchGetOutletDetail();
  }

  private createDaySchedule() {
    return this.formBuilder.nonNullable.group({
      open: ['08:00', Validators.required],
      close: ['17:00', Validators.required],
      isClosed: ['false'],
    });
  }

  fetchGetOutletDetail(): void {
    this.fetchGetOutletDetailLoading.set(true);
    this.onboardingService
      .getOutletDetail()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: Outlet) => {
          console.log('response: ', response);
          this.fetchGetOutletDetailLoading.set(false);
        },
        error: (err) => {
          console.log('err: ', err);
          this.fetchGetOutletDetailLoading.set(false);
        },
      });
  }

  goToSetupStorePage(): void {
    this.router.navigate(['/onboarding', 'setup-store']);
  }

  onSubmit(): void {
    if (this.setupOutletForm.invalid) {
      this.setupOutletForm.markAllAsTouched();
      return;
    }

    this.submitSetupOutletLoading.set(true);
  }
}
