import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectSidebarOpen } from './store/sidebar.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import * as SidebarActions from './store/sidebar.actions';
import { SideBarLink } from '../../shared/models/side-bar-link.model';

@Component({
  selector: 'app-side-bar-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './side-bar-layout.html',
  styleUrl: './side-bar-layout.css',
})
export class SideBarLayout {
  private readonly store = inject(Store);

  isOpen$ = this.store.select(selectSidebarOpen);

  links: SideBarLink[] = [
    {
      label: 'Dashboard',
      path: '/dashboard',
    },
  ];

  isOpen = toSignal(this.store.select(selectSidebarOpen), {
    initialValue: false,
  });

  sideBarClasses = computed(() => {
    const base =
      'w-full h-auto max-w-[15rem] min-w-[15rem] flex flex-col items-start justify-start fixed top-0 left-0 bottom-0 bg-white border-r border-gray-200 shadow-md z-50 transform transition-transform duration-200';

    const openStyle = 'translate-x-0';
    const closeStyle = '-translate-x-full md:translate-x-0';

    if (this.isOpen()) return `${base} ${openStyle}`;

    return `${base} ${closeStyle}`;
  });

  close(): void {
    this.store.dispatch(SidebarActions.closeSidebar());
  }
}
