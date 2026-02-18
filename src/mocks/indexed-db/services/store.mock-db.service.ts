import { Injectable } from '@angular/core';
import { db } from '../app.db';
import { Store } from '../../../app/features/store/models/store.model';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class StoreMockDbService {
  async getAll(): Promise<Store[]> {
    return await db.stores.toArray();
  }

  async getById(id: string): Promise<Store | undefined> {
    return await db.stores.get(id);
  }

  async create(payload: Omit<Store, 'id'>): Promise<Store> {
    const newStore: Store = {
      id: uuid(),
      ...payload,
    };

    await db.stores.add(newStore);

    return newStore;
  }

  async update(id: string, payload: Partial<Store>): Promise<void> {
    await db.stores.update(id, payload);
  }

  async delete(id: string): Promise<void> {
    await db.stores.delete(id);
  }

  async clear(): Promise<void> {
    await db.stores.clear();
  }
}

export const storeMockDbService = new StoreMockDbService();
