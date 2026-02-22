import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SnackbarState } from './snackbar.state';

export const selectSnackbarState = createFeatureSelector<SnackbarState>('snackbar');

export const selectVisibleSnackbars = createSelector(selectSnackbarState, (state) => state.visible);

export const selectQueue = createSelector(selectSnackbarState, (state) => state.queue);
