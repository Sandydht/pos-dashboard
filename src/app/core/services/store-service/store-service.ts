import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '../../../features/store/models/store.model';
import { environment } from '../../../../environments/environment';
import { CreateStoreRequest } from '../../../features/store/models/create-store-request.model';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  createStore(payload: CreateStoreRequest): Observable<Store | null> {
    return this.http.post<Store>(`${this.apiUrl}/store/create`, payload);
  }
}
