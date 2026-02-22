import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as SnackbarActions from './store/snackbar.actions';
import { CommonModule } from '@angular/common';
import { selectVisibleSnackbars } from './store/snackbar.selectors';

@Component({
  selector: 'app-snackbar',
  imports: [CommonModule],
  templateUrl: './snackbar.html',
  styleUrl: './snackbar.css',
})
export class SnackbarComponent {
  private readonly store = inject(Store);

  snackbars$ = this.store.select(selectVisibleSnackbars);

  close(id: string) {
    this.store.dispatch(SnackbarActions.dismissSnackbar({ id }));
    this.store.dispatch(SnackbarActions.processQueue());
  }
}
