import { createAction, props } from '@ngrx/store';
import { SnackbarItem, SnackbarVariant } from './snackbar.state';

export const showSnackbar = createAction(
  '[Snackbar] Show',
  props<{
    message: string;
    variant?: SnackbarVariant;
    duration?: number;
  }>(),
);

export const processQueue = createAction('[Snackbar] Process Queue');

export const snackbarDisplayed = createAction(
  '[Snackbar] Displayed',
  props<{ item: SnackbarItem }>(),
);

export const dismissSnackbar = createAction('[Snackbar] Dismiss', props<{ id: string }>());
