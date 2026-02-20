import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { OnboardingStatus } from '../../../features/onboarding/models/onboarding-status.model';
import { catchError, Observable, of, shareReplay, tap } from 'rxjs';
import { Store } from '../../../features/store/models/store.model';
import { OnboardingCreateStoreRequest } from '../../../features/onboarding/models/onboarding-create-store-request.model';
import { Outlet } from '../../../features/outlet/models/outlet.model';

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  status = signal<OnboardingStatus | null>(null);

  getOnboardingStatus(): Observable<OnboardingStatus | null> {
    return this.http.get<OnboardingStatus>(`${this.apiUrl}/onboarding/status`).pipe(
      tap((response: OnboardingStatus) => this.status.set(response)),
      catchError(() => {
        this.status.set(null);
        return of(null);
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  getStoreDetail(): Observable<Store> {
    return this.http.get<Store>(`${this.apiUrl}/onboarding/store-detail`);
  }

  createStore(payload: OnboardingCreateStoreRequest): Observable<Store> {
    return this.http.post<Store>(`${this.apiUrl}/onboarding/create-store`, payload);
  }

  getOutletDetail(): Observable<Outlet> {
    return this.http.get<Outlet>(`${this.apiUrl}/onboarding/outlet-detail`);
  }
}
