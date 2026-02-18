import { Injectable } from '@angular/core';
import { db } from '../app.db';
import { v4 as uuid } from 'uuid';
import { User } from '../../../app/features/auth/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserMockDbService {
  async getAll(): Promise<User[]> {
    return await db.users.toArray();
  }

  async getById(id: string): Promise<User | undefined> {
    return await db.users.get(id);
  }

  async create(payload: Omit<User, 'id'>): Promise<User> {
    const newUser: User = {
      id: uuid(),
      ...payload,
    };

    await db.users.add(newUser);

    return newUser;
  }

  async update(id: string, payload: Partial<User>): Promise<void> {
    await db.users.update(id, payload);
  }

  async delete(id: string): Promise<void> {
    await db.users.delete(id);
  }

  async clear(): Promise<void> {
    await db.users.clear();
  }
}

export const userMockService = new UserMockDbService();
