import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { onboardingGuardGuard } from './onboarding-guard-guard';

describe('onboardingGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => onboardingGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
