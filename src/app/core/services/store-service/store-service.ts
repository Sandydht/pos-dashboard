import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, shareReplay, tap } from 'rxjs';
import { Store } from '../../../features/store/models/store.model';
import { environment } from '../../../../environments/environment';
import { StorageService } from '../storage-service/storage-service';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private readonly http = inject(HttpClient);
  private readonly storageService = inject(StorageService);
  private readonly apiUrl = environment.apiUrl;

  storeIdSignal = signal<string | null>(this.storageService.get('storeId'));
  hasSetupStore = computed(() => !!this.storeIdSignal());

  checkStore(): Observable<Store | null> {
    console.log('checkStore');
    return this.http.get<Store>(`${this.apiUrl}/store/check`).pipe(
      tap((response: Store) => {
        this.storageService.set('storeId', response.id);
        this.storeIdSignal.set(response.id);
      }),
      catchError(() => {
        this.storageService.remove('storeId');
        this.storeIdSignal.set(null);
        return of(null);
      }),
      shareReplay(1),
    );
  }
}
