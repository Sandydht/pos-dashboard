import { computed, inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterResponse } from '../../../features/auth/models/register-response.model';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest } from '../../../features/auth/models/register-request.model';
import { StorageService } from '../storage-service/storage-service';
import { environment } from '../../../../environments/environment';
import { LoginRequest } from '../../../features/auth/models/login-request.model';
import { LoginResponse } from '../../../features/auth/models/login-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storageService = inject(StorageService);
  private readonly apiUrl = environment.apiUrl;

  token = computed(() => this.storageService.get('token'));

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/auth/register`, payload);
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, payload);
  }

  logout(): void {
    this.storageService.clear();
  }
}
