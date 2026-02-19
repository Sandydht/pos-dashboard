import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Outlet } from '../../../features/outlet/models/outlet.model';
import { CreateOutletRequest } from '../../../features/outlet/models/create-outlet-request.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OutletService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  createStore(payload: CreateOutletRequest): Observable<Outlet> {
    return this.http.post<Outlet>(`${this.apiUrl}/outlet/create`, payload);
  }
}
