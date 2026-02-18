import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StoreService } from '../../services/store-service/store-service';

export const onboardingGuardGuard: CanActivateFn = () => {
  const storeService = inject(StoreService);
  const router = inject(Router);

  if (!storeService.hasSetupStore()) {
    router.navigate(['/onboarding']);
    return false;
  }

  return true;
};
