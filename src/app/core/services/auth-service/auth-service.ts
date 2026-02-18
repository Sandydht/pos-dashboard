import { computed, inject, Injectable, signal } from '@angular/core';
import { map, Observable, switchMap, tap } from 'rxjs';
import { RegisterResponse } from '../../../features/auth/models/register-response.model';
import { HttpClient, HttpContext } from '@angular/common/http';
import { RegisterRequest } from '../../../features/auth/models/register-request.model';
import { StorageService } from '../storage-service/storage-service';
import { environment } from '../../../../environments/environment';
import { LoginRequest } from '../../../features/auth/models/login-request.model';
import { LoginResponse } from '../../../features/auth/models/login-response.model';
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
  userData = signal<User>({
    id: '',
    username: '',
    email: '',
    phoneNumber: '',
    fullName: '',
    roles: [],
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  });

  token = computed(() => this.tokenSignal());

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/auth/register`, payload, {
      context: new HttpContext().set(IS_PUBLIC_API, true),
    });
  }

  login(payload: LoginRequest): Observable<{
    login: LoginResponse;
    profile: UserProfileResponse;
  }> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, payload, {
        context: new HttpContext().set(IS_PUBLIC_API, true),
      })
      .pipe(
        tap((response: LoginResponse) => {
          this.storageService.set('token', response.accessToken);
          this.tokenSignal.set(response.accessToken);
        }),
        switchMap((response: LoginResponse) => {
          return this.profile().pipe(
            map((profileResponse: UserProfileResponse) => ({
              login: response,
              profile: profileResponse,
            })),
          );
        }),
      );
  }

  profile(): Observable<UserProfileResponse> {
    return this.http
      .get<UserProfileResponse>(`${this.apiUrl}/auth/profile`)
      .pipe(tap((response: UserProfileResponse) => this.userData.set({ ...response })));
  }

  logout(): void {
    this.storageService.clear();
    this.userData.set({
      id: '',
      username: '',
      email: '',
      phoneNumber: '',
      fullName: '',
      roles: [],
      createdAt: '',
      updatedAt: '',
      deletedAt: '',
    });
    this.router.navigate(['/login']);
  }

  loadToken() {
    const saved: string | null = this.storageService.get('token');
    if (saved) {
      this.tokenSignal.set(saved);
    }
  }
}
