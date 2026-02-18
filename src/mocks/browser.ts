import { setupWorker } from 'msw/browser';
import { authHandlers } from './handlers/auth.handler';
import { onboardingHandlers } from './handlers/onboarding.handler';
import { storeHandlers } from './handlers/store.handler';

export const worker = setupWorker(...authHandlers, ...onboardingHandlers, ...storeHandlers);
