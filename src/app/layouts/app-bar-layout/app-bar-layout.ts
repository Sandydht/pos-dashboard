import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth-service/auth-service';
import { Store } from '@ngrx/store';
import * as SidebarActions from '../side-bar-layout/store/sidebar.actions';

@Component({
  selector: 'app-bar-layout',
  imports: [],
  templateUrl: './app-bar-layout.html',
  styleUrl: './app-bar-layout.css',
})
export class AppBarLayout {
  private readonly authService = inject(AuthService);
  private readonly store = inject(Store);

  userFullName = computed(() => this.authService.userFullName());

  openSideBar(): void {
    this.store.dispatch(SidebarActions.openSidebar());
  }
}
