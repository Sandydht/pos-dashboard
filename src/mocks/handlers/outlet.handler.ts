import { http, HttpResponse } from 'msw';
import { CreateOutletRequest } from '../../app/features/outlet/models/create-outlet-request.model';
import { decrypt } from '../utils/crypto';
import { db } from '../indexed-db/app.db';

export const outletHandlers = [
  http.post('/api/outlet/create', async ({ request }) => {
    const body = (await request.json()) as CreateOutletRequest;

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
    if (!findStoreByOwnerId) {
      return HttpResponse.json({ message: "You haven't setup a store yet" }, { status: 400 });
    }

    const findOutletByCode = await db.outlets.where('code').equals(body.code).first();
    if (findOutletByCode) {
      return HttpResponse.json({ message: 'Outlet already exist' }, { status: 400 });
    }

    return HttpResponse.json({ message: 'success' }, { status: 201 });
  }),
];
