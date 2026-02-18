import { setupWorker } from 'msw/browser';
import { authHandlers } from './handlers/auth.handler';

export const worker = setupWorker(...authHandlers);
