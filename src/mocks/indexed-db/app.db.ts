import Dexie, { Table } from 'dexie';
import { User } from '../../app/features/auth/models/user.model';

export class MockAppDB extends Dexie {
  users!: Table<User, string>;

  constructor() {
    super('MockEmployeeDB');

    this.version(1).stores({
      users: 'id, username, email, phoneNumber',
    });
  }
}

export const db = new MockAppDB();
