import { Routes } from '@angular/router';
import { authGuardGuard } from './core/guards/auth-guard/auth-guard-guard';
import { MainLayout } from './layouts/main-layout/main-layout';
import { onboardingGuardGuard } from './core/guards/onboarding-guard/onboarding-guard-guard';

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
    path: 'onboarding',
    canActivate: [authGuardGuard],
    children: [
      { path: '', redirectTo: 'setup-store', pathMatch: 'full' },
      {
        path: 'setup-store',
        loadComponent: () =>
          import('../app/features/onboarding/pages/setup-store-page/setup-store-page').then(
            (m) => m.SetupStorePage,
          ),
      },
      {
        path: 'setup-product-and-catalog',
        loadComponent: () =>
          import('../app/features/onboarding/pages/setup-product-and-catalog-page/setup-product-and-catalog-page').then(
            (m) => m.SetupProductAndCatalogPage,
          ),
      },
    ],
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuardGuard, onboardingGuardGuard],
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
