import { createReducer, on } from '@ngrx/store';
import * as SnackbarActions from './snackbar.actions';
import { initialSnackbarState, SnackbarItem } from './snackbar.state';
import { v4 as uuid } from 'uuid';

export const snackbarReducer = createReducer(
  initialSnackbarState,

  on(SnackbarActions.showSnackbar, (state, payload) => {
    const newItem: SnackbarItem = {
      id: uuid(),
      message: payload.message,
      variant: payload.variant ?? 'info',
      duration: payload.duration ?? 3000,
    };

    return {
      ...state,
      queue: [...state.queue, newItem],
    };
  }),

  on(SnackbarActions.snackbarDisplayed, (state, { item }) => ({
    ...state,
    visible: [...state.visible, item],
    queue: state.queue.slice(1),
  })),

  on(SnackbarActions.dismissSnackbar, (state, { id }) => ({
    ...state,
    visible: state.visible.filter((snack) => snack.id !== id),
  })),
);
