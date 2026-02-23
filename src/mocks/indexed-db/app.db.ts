import Dexie, { Table } from 'dexie';
import { User } from '../../app/features/auth/models/user.model';
import { Store } from '../../app/features/store/models/store.model';
import { Outlet } from '../../app/features/outlet/models/outlet.model';
import { UploadedFileEntity } from '../../app/shared/models/uploaded-file-entity.model';

export class MockAppDB extends Dexie {
  users!: Table<User, string>;
  stores!: Table<Store, string>;
  outlets!: Table<Outlet, string>;
  uploads!: Table<UploadedFileEntity, string>;

  constructor() {
    super('MockEmployeeDB');

    this.version(1).stores({
      users: 'id, username, email, phoneNumber, password',
      stores: 'id, code, name, ownerId, [code+name]',
      outlets: 'id, storeId, code, name, [code+name]',
      uploads: 'id, context, entityId, name, type, [context+entityId]',
    });
  }
}

export const db = new MockAppDB();
