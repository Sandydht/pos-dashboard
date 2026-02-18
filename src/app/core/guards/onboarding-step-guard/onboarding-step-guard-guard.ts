import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { OnboardingService } from '../../services/onboarding-service/onboarding-service';
import { OnboardingStatus } from '../../../features/onboarding/models/onboarding-status.model';

export const onboardingStepGuardGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const onboardingService = inject(OnboardingService);
  const router = inject(Router);

  const status: OnboardingStatus | null = onboardingService.status();

  if (!status) {
    router.navigate(['/register']);
    return false;
  }

  if (status === 'complete') {
    router.navigate(['/dashboard']);
    return false;
  }

  const requestedStep = route.routeConfig?.path;

  if (requestedStep !== status) {
    router.navigate(['/onboarding', status]);
    return false;
  }

  return true;
};
