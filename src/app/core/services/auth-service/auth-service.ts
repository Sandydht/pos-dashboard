import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { HttpClient, HttpContext } from '@angular/common/http';
import { RegisterRequest } from '../../../features/auth/models/register-request.model';
import { StorageService } from '../storage-service/storage-service';
import { environment } from '../../../../environments/environment';
import { LoginRequest } from '../../../features/auth/models/login-request.model';
import { RegisterLoginResponse } from '../../../features/auth/models/register-login-response.model';
import { UserProfileResponse } from '../../../features/auth/models/user-profile-response.model';
import { IS_PUBLIC_API } from '../../interceptors/request-context.interceptor';
import { User } from '../../../features/auth/models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storageService = inject(StorageService);
  private readonly router = inject(Router);
  private readonly apiUrl = environment.apiUrl;

  tokenSignal = signal<string | null>(this.storageService.get('token'));
  userData = signal<User | null>(null);

  token = computed(() => this.tokenSignal());
  userId = computed(() => this.userData()?.id ?? '');
  userFullName = computed(() => this.userData()?.fullName ?? '');

  register(payload: RegisterRequest): Observable<UserProfileResponse | null> {
    return this.http
      .post<RegisterLoginResponse>(`${this.apiUrl}/auth/register`, payload, {
        context: new HttpContext().set(IS_PUBLIC_API, true),
      })
      .pipe(
        tap((response: RegisterLoginResponse) => {
          this.storageService.set('token', response.accessToken);
          this.tokenSignal.set(response.accessToken);
        }),
        catchError(() => {
          this.tokenSignal.set(null);
          this.storageService.remove('token');
          return of(null);
        }),
        switchMap(() => this.profile()),
      );
  }

  login(payload: LoginRequest): Observable<UserProfileResponse | null> {
    return this.http
      .post<RegisterLoginResponse>(`${this.apiUrl}/auth/login`, payload, {
        context: new HttpContext().set(IS_PUBLIC_API, true),
      })
      .pipe(
        tap((response: RegisterLoginResponse) => {
          this.storageService.set('token', response.accessToken);
          this.tokenSignal.set(response.accessToken);
        }),
        catchError(() => {
          this.tokenSignal.set(null);
          this.storageService.remove('token');
          return of(null);
        }),
        switchMap(() => this.profile()),
      );
  }

  profile(): Observable<UserProfileResponse | null> {
    return this.http.get<UserProfileResponse>(`${this.apiUrl}/auth/profile`).pipe(
      tap((response: UserProfileResponse) => this.userData.set(response)),
      catchError(() => {
        this.userData.set(null);
        return of(null);
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  logout(): void {
    this.storageService.remove('token');
    this.tokenSignal.set(null);
    this.userData.set(null);
    this.router.navigate(['/login']);
  }
}
