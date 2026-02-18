import { Routes } from '@angular/router';

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
