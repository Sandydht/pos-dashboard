import { http, HttpResponse } from 'msw';
import { decrypt } from '../utils/crypto';
import { db } from '../indexed-db/app.db';
import { CreateStoreRequest } from '../../app/features/store/models/create-store-request.model';
import { storeMockDbService } from '../indexed-db/services/store.mock-db.service';

export const storeHandlers = [
  http.post('/api/store/create', async ({ request }) => {
    const body = (await request.json()) as CreateStoreRequest;

    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decryptedToken = decrypt(token);
    const user = await db.users.get(decryptedToken);
    if (!user) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const findStoreByOwnerId = await db.stores.where('ownerId').equals(user.id).first();
    if (findStoreByOwnerId) {
      return HttpResponse.json({ message: 'You have setup the store' }, { status: 400 });
    }

    const findStoreByCode = await db.stores.where('code').equals(body.code).first();
    if (findStoreByCode) {
      return HttpResponse.json({ message: 'Store already exist' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const newStore = await storeMockDbService.create({
      photoUrl: body.photoUrl,
      code: body.code,
      name: body.name,
      ownerId: body.ownerId,
      createdAt: now,
      updatedAt: null,
      deletedAt: null,
    });

    return HttpResponse.json(newStore, { status: 201 });
  }),
];
