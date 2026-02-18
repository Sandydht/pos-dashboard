import { Routes } from '@angular/router';
import { authGuardGuard } from './core/guards/auth-guard/auth-guard-guard';
import { MainLayout } from './layouts/main-layout/main-layout';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'register',
    loadComponent: () =>
      import('../app/features/auth/pages/register-page/register-page').then((m) => m.RegisterPage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../app/features/auth/pages/login-page/login-page').then((m) => m.LoginPage),
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuardGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../app/features/dashboard/pages/dashboard-overview-page/dashboard-overview-page').then(
            (m) => m.DashboardOverviewPage,
          ),
      },
    ],
  },
];
