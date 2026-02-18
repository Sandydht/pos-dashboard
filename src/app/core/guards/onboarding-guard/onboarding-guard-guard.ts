import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OnboardingService } from '../../services/onboarding-service/onboarding-service';

export const onboardingGuardGuard: CanActivateFn = () => {
  const onboardingService = inject(OnboardingService);
  const router = inject(Router);

  if (!onboardingService.status()) {
    router.navigate(['/register']);
    return false;
  }

  if (onboardingService.status() !== 'complete') {
    router.navigate(['/onboarding', onboardingService.status()]);
    return false;
  }

  return true;
};
