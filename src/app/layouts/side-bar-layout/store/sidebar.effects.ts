import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as SidebarActions from './sidebar.actions';
import { tap } from 'rxjs/operators';

export class SidebarEffects {
  actions$ = inject(Actions);

  lockScroll$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SidebarActions.openSidebar, SidebarActions.closeSidebar),
        tap((action) => {
          if (action.type === SidebarActions.openSidebar.type) {
            document.body.style.overflow = 'hidden';
          } else {
            document.body.style.overflow = 'unset';
          }
        }),
      ),
    { dispatch: false },
  );
}
