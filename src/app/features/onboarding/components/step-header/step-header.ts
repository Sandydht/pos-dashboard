import { Component, computed, input } from '@angular/core';
import { OnboardingStep } from '../../models/onboarding-step.model';
import { CommonModule } from '@angular/common';
import { OnboardingStatus } from '../../models/onboarding-status.model';

@Component({
  selector: 'app-step-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-header.html',
  styleUrl: './step-header.css',
})
export class StepHeaderComponent {
  selectedStep = input<OnboardingStatus>('register-account');

  steps: OnboardingStep[] = [
    {
      key: 'register-account',
      label: 'Register Account',
      isComplete: false,
    },
    {
      key: 'setup-store',
      label: 'Store Setup',
      isComplete: false,
    },
    {
      key: 'setup-outlet',
      label: 'Outlet Setup',
      isComplete: false,
    },
    {
      key: 'setup-product-and-catalog',
      label: 'Product Setup',
      isComplete: false,
    },
  ];

  currentIndex = computed(() => this.steps.findIndex((s) => s.key === this.selectedStep()));

  datas = computed(() =>
    this.steps.map((step, index) => ({
      ...step,
      isComplete: index <= this.currentIndex(),
    })),
  );
}
