import { http, HttpResponse } from 'msw';
import { decrypt } from '../utils/crypto';
import { db } from '../indexed-db/app.db';

export const storeHandlers = [
  http.get('/api/store/check', async ({ request }) => {
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

    const store = await db.stores.where('ownerId').equals(user.id).first();
    if (!store) {
      return HttpResponse.json({ message: "You haven't setup a store yet" }, { status: 200 });
    }

    return HttpResponse.json({ message: 'Store has been set up' }, { status: 200 });
  }),
];
