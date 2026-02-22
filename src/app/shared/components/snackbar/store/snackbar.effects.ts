/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import * as SnackbarActions from './snackbar.actions';
import { selectQueue, selectVisibleSnackbars } from './snackbar.selectors';

import { filter, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { timer } from 'rxjs';

export class SnackbarEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);

  MAX_VISIBLE: number = 3;

  processQueue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SnackbarActions.processQueue),

      withLatestFrom(this.store.select(selectVisibleSnackbars), this.store.select(selectQueue)),

      filter(([_, visible, queue]) => visible.length < this.MAX_VISIBLE && queue.length > 0),

      map(([_, __, queue]) => SnackbarActions.snackbarDisplayed({ item: queue[0] })),
    ),
  );

  autoDismiss$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SnackbarActions.snackbarDisplayed),

      mergeMap(({ item }) =>
        timer(item.duration).pipe(
          mergeMap(() => [
            SnackbarActions.dismissSnackbar({ id: item.id }),
            SnackbarActions.processQueue(),
          ]),
        ),
      ),
    ),
  );

  triggerQueue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SnackbarActions.showSnackbar),
      map(() => SnackbarActions.processQueue()),
    ),
  );
}
