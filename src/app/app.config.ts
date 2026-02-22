import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AuthService } from './core/services/auth-service/auth-service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { publicInterceptor } from './core/interceptors/public.interceptor';
import { privateInterceptor } from './core/interceptors/private.interceptor';
import { authErrorInterceptor } from './core/interceptors/auth-error.interceptor';
import { firstValueFrom } from 'rxjs';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { sidebarReducer } from './layouts/side-bar-layout/store/sidebar.reducer';
import { SidebarEffects } from './layouts/side-bar-layout/store/sidebar.effects';
import { OnboardingService } from './core/services/onboarding-service/onboarding-service';
import { snackbarReducer } from './shared/components/snackbar/store/snackbar.reducer';
import { SnackbarEffects } from './shared/components/snackbar/store/snackbar.effects';

export const initApp = (authService: AuthService, onboardingService: OnboardingService) => {
  return async () => {
    if (!authService.token()) {
      return;
    }

    await firstValueFrom(authService.profile());

    if (!authService.userId()) {
      return;
    }

    await firstValueFrom(onboardingService.getOnboardingStatus());
  };
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([publicInterceptor, privateInterceptor, authErrorInterceptor]),
    ),
    provideStore({
      sidebar: sidebarReducer,
      snackbar: snackbarReducer,
    }),
    provideEffects([SidebarEffects, SnackbarEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production,
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [AuthService, OnboardingService],
      multi: true,
    },
  ],
};
