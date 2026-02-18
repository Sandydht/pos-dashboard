import { Injectable } from '@angular/core';
import { db } from '../app.db';
import { Store } from '../../../app/features/store/models/store.model';
import { v4 as uuid } from 'uuid';
import { Outlet } from '../../../app/features/outlet/models/outlet.model';

@Injectable({
  providedIn: 'root',
})
export class OutletMockDbService {
  async getAll(): Promise<Outlet[]> {
    return await db.outlets.toArray();
  }

  async getById(id: string): Promise<Outlet | undefined> {
    return await db.outlets.get(id);
  }

  async create(payload: Omit<Outlet, 'id'>): Promise<Outlet> {
    const newOutlet: Outlet = {
      id: uuid(),
      ...payload,
    };

    await db.outlets.add(newOutlet);

    return newOutlet;
  }

  async update(id: string, payload: Partial<Outlet>): Promise<void> {
    await db.outlets.update(id, payload);
  }

  async delete(id: string): Promise<void> {
    await db.outlets.delete(id);
  }

  async clear(): Promise<void> {
    await db.outlets.clear();
  }
}

export const outletMockDbService = new OutletMockDbService();
