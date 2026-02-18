import { createReducer, on } from '@ngrx/store';
import * as SidebarActions from './sidebar.actions';
import { initialSidebarState } from './sidebar.state';

export const sidebarReducer = createReducer(
  initialSidebarState,

  on(SidebarActions.openSidebar, (state) => ({
    ...state,
    isOpen: true,
  })),

  on(SidebarActions.closeSidebar, (state) => ({
    ...state,
    isOpen: false,
  })),

  on(SidebarActions.toggleSidebar, (state) => ({
    ...state,
    isOpen: !state.isOpen,
  })),
);
