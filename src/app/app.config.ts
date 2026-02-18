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

export const initUserProfile = (authService: AuthService) => {
  return async () => {
    authService.loadToken();

    if (authService.token()) {
      await firstValueFrom(authService.profile());
    }
  };
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([publicInterceptor, privateInterceptor, authErrorInterceptor]),
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initUserProfile,
      deps: [AuthService],
      multi: true,
    },
  ],
};
