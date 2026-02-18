import { http, HttpResponse } from 'msw';
import { decrypt } from '../utils/crypto';
import { db } from '../indexed-db/app.db';
import { OnboardingStatus } from '../../app/features/onboarding/models/onboarding-status.model';
import { Store } from '../../app/features/store/models/store.model';
import { Outlet } from '../../app/features/outlet/models/outlet.model';

export const onboardingHandlers = [
  http.get('/api/onboarding/status', async ({ request }) => {
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

    const store: Store | undefined = await db.stores.where('ownerId').equals(user.id).first();
    if (!store || store === undefined) {
      return HttpResponse.json('setup-store' as OnboardingStatus, { status: 200 });
    }

    const outlet: Outlet | undefined = await db.outlets.where('storeId').equals(store.id).first();
    if (!outlet || outlet === undefined) {
      return HttpResponse.json('setup-outlet' as OnboardingStatus, { status: 200 });
    }

    return HttpResponse.json('complete', { status: 200 });
  }),
];
