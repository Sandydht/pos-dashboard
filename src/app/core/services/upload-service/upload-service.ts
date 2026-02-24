import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { UploadRequest } from '../../../shared/models/upload-request.model';
import { Observable } from 'rxjs';
import { UploadResponse } from '../../../shared/models/upload-response.model';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  upload(request: UploadRequest): Observable<string> {
    const formData = new FormData();
    formData.append('file', request.file);
    formData.append('context', request.context);

    if (request.entityId) {
      formData.append('entityId', request.entityId);
    }

    return this.http.post<string>(`${this.apiUrl}/uploads`, formData);
  }

  getFile(entityId: string): Observable<UploadResponse> {
    return this.http.get<UploadResponse>(`${this.apiUrl}/uploads/${entityId}`);
  }
}
