import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SidebarState } from './sidebar.state';

export const selectSidebarState = createFeatureSelector<SidebarState>('sidebar');

export const selectSidebarOpen = createSelector(selectSidebarState, (state) => state.isOpen);
