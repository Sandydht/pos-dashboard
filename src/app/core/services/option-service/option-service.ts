import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable, shareReplay } from 'rxjs';
import { Country } from '../../../shared/models/country.model';
import { Province } from '../../../shared/models/province.model';
import { City } from '../../../shared/models/city.model';
import { PaginatedResult } from '../../../shared/models/paginated-result.model';
import { PaginationQuery } from '../../../shared/models/pagination-query.model';

@Injectable({
  providedIn: 'root',
})
export class OptionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  private countries$?: Observable<Country[]>;

  private buildPaginationParams(payload: PaginationQuery): HttpParams {
    let params = new HttpParams()
      .set('page', String(payload.page ?? 1))
      .set('size', String(payload.size ?? 10))
      .set('sortBy', payload.sortBy ?? 'name')
      .set('sortOrder', payload.sortOrder ?? 'asc');

    if (payload.search) {
      params = params.set('search', payload.search);
    }

    return params;
  }

  getCountriesOption(): Observable<Country[]> {
    if (!this.countries$) {
      this.countries$ = this.http
        .get<Country[]>(`${this.apiUrl}/countries`)
        .pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }

    return this.countries$;
  }

  getProvincesOption(
    countryId: string,
    payload: PaginationQuery,
  ): Observable<PaginatedResult<Province>> {
    const params = this.buildPaginationParams(payload);
    return this.http.get<PaginatedResult<Province>>(
      `${this.apiUrl}/countries/${countryId}/provinces`,
      { params },
    );
  }

  getCitiesOption(provinceId: string, payload: PaginationQuery): Observable<PaginatedResult<City>> {
    const params = this.buildPaginationParams(payload);
    return this.http.get<PaginatedResult<City>>(`${this.apiUrl}/provinces/${provinceId}/cities`, {
      params,
    });
  }
}
