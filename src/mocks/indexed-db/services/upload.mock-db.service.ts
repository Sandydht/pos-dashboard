import { Injectable } from '@angular/core';
import { UploadedFileEntity } from '../../../app/shared/models/uploaded-file-entity.model';
import { db } from '../app.db';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class UploadMockDbService {
  async getAll(): Promise<UploadedFileEntity[]> {
    return await db.uploads.toArray();
  }

  async getById(id: string): Promise<UploadedFileEntity | undefined> {
    return await db.uploads.get(id);
  }

  async create(payload: Omit<UploadedFileEntity, 'id'>): Promise<UploadedFileEntity> {
    const newUpload: UploadedFileEntity = {
      id: uuid(),
      ...payload,
    };

    await db.uploads.add(newUpload);

    return newUpload;
  }

  async update(id: string, payload: Partial<UploadedFileEntity>): Promise<void> {
    await db.uploads.update(id, payload);
  }

  async delete(id: string): Promise<void> {
    await db.stores.delete(id);
  }

  async clear(): Promise<void> {
    await db.stores.clear();
  }
}

export const uploadMockDbService = new UploadMockDbService();
