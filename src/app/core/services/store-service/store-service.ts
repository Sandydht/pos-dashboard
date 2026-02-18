import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, shareReplay, tap } from 'rxjs';
import { Store } from '../../../features/store/models/store.model';
import { environment } from '../../../../environments/environment';
import { CreateStoreRequest } from '../../../features/store/models/create-store-request.model';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  storeId = signal<string | null>(null);
  hasSetupStore = computed(() => !!this.storeId());

  checkStore(): Observable<Store | null> {
    return this.http.get<Store>(`${this.apiUrl}/store/check`).pipe(
      tap((response: Store) => {
        this.storeId.set(response.id);
      }),
      catchError(() => {
        this.storeId.set(null);
        return of(null);
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  createStore(payload: CreateStoreRequest): Observable<Store | null> {
    return this.http.post<Store>(`${this.apiUrl}/store/create`, payload).pipe(
      tap((response: Store) => this.storeId.set(response.id)),
      catchError(() => {
        this.storeId.set(null);
        return of(null);
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }
}
