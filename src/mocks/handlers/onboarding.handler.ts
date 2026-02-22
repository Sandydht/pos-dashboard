import { http, HttpResponse } from 'msw';
import { decrypt } from '../utils/crypto';
import { db } from '../indexed-db/app.db';
import { OnboardingStatus } from '../../app/features/onboarding/models/onboarding-status.model';
import { Store } from '../../app/features/store/models/store.model';
import { Outlet } from '../../app/features/outlet/models/outlet.model';
import { storeMockDbService } from '../indexed-db/services/store.mock-db.service';
import { OnboardingCreateStoreRequest } from '../../app/features/onboarding/models/onboarding-create-store-request.model';
import { OnboardingCreateOutletRequest } from '../../app/features/onboarding/models/onboarding-create-outlet-request.model';
import { outletMockDbService } from '../indexed-db/services/outlet.mock-db.service';

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

  http.get('/api/onboarding/store-detail', async ({ request }) => {
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
      return HttpResponse.json({ message: "You haven't setup a store yet" }, { status: 200 });
    }

    return HttpResponse.json(store, { status: 200 });
  }),

  http.post('/api/onboarding/create-store', async ({ request }) => {
    const body = (await request.json()) as OnboardingCreateStoreRequest;

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

    const findOtheStore: Store | undefined = await db.stores
      .where('[code+name]')
      .equals([body.code, body.name])
      .and((store) => store.ownerId !== user.id)
      .first();

    if (findOtheStore) {
      return HttpResponse.json({ message: 'Store already exist' }, { status: 400 });
    }

    const store: Store | undefined = await db.stores.where('ownerId').equals(user.id).first();
    const now = new Date().toISOString();
    if (store) {
      await storeMockDbService.update(store.id, {
        ...body,
        updatedAt: now,
      });

      const updatedStore: Store | undefined = await storeMockDbService.getById(store.id);
      return HttpResponse.json(updatedStore, { status: 200 });
    }

    const newStore: Store = await storeMockDbService.create({
      ...body,
      ownerId: user.id,
      createdAt: now,
      updatedAt: null,
      deletedAt: null,
    });

    return HttpResponse.json(newStore, { status: 200 });
  }),

  http.get('/api/onboarding/outlet-detail', async ({ request }) => {
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
      return HttpResponse.json({ message: "You haven't setup a store yet" }, { status: 200 });
    }

    const outlet: Outlet | undefined = await db.outlets.where('storeId').equals(store.id).first();
    if (!outlet || outlet === undefined) {
      return HttpResponse.json({ message: "You haven't setup a outlet yet" }, { status: 200 });
    }

    return HttpResponse.json(outlet, { status: 200 });
  }),

  http.post('/api/onboarding/create-outlet', async ({ request }) => {
    const body = (await request.json()) as OnboardingCreateOutletRequest;

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
      return HttpResponse.json({ message: "You haven't setup a store yet" }, { status: 400 });
    }

    const findOtherOutlet: Outlet | undefined = await db.outlets
      .where('[code+name]')
      .equals([body.code, body.name])
      .and((outlet) => outlet.storeId !== store.id)
      .first();

    if (findOtherOutlet) {
      return HttpResponse.json({ message: 'Store already exist' }, { status: 400 });
    }

    const findOutlet: Outlet | undefined = await db.outlets
      .where('storeId')
      .equals(store.id)
      .first();
    const now = new Date().toISOString();
    if (findOutlet) {
      await outletMockDbService.update(findOutlet.id, {
        ...body,
        updatedAt: now,
      });

      const updatedOutlet: Outlet | undefined = await outletMockDbService.getById(findOutlet.id);
      return HttpResponse.json(updatedOutlet, { status: 200 });
    }

    const newOutlet: Outlet | undefined = await outletMockDbService.create({
      ...body,
      storeId: store.id,
      isActive: true,
      createdAt: now,
      updatedAt: null,
      deletedAt: null,
    });

    return HttpResponse.json(newOutlet, { status: 201 });
  }),
];
