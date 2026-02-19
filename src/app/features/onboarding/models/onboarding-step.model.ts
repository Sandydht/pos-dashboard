import { OnboardingStatus } from './onboarding-status.model';

export interface OnboardingStep {
  key: OnboardingStatus;
  label: string;
  isComplete: boolean;
}
