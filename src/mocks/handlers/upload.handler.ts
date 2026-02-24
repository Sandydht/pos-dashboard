import { http, HttpResponse } from 'msw';
import { decrypt } from '../utils/crypto';
import { db } from '../indexed-db/app.db';
import { uploadMockDbService } from '../indexed-db/services/upload.mock-db.service';
import { UploadContext } from '../../app/shared/models/upload-context.model';

export const uploadHandlers = [
  http.post('/api/uploads', async ({ request }) => {
    const formData = await request.formData();

    const file = formData.get('file') as File | null;
    const context = formData.get('context') as UploadContext;
    const entityId = formData.get('entityId') as string | null;

    if (!file || !context) {
      return HttpResponse.json({ message: 'Invalid upload payload' }, { status: 400 });
    }

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

    const now = new Date().toISOString();
    const newUpload = await uploadMockDbService.create({
      context,
      entityId,
      name: file.name,
      type: file.type,
      blob: file,
      createdAt: now,
      updatedAt: null,
      deletedAt: null,
    });

    const fakeUrl = `/mock-storage/uploads/${newUpload.id}`;

    return HttpResponse.json(fakeUrl, { status: 201 });
  }),

  http.get('/api/uploads/:entityId', async ({ params, request }) => {
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

    const { entityId } = params;
    if (!entityId) {
      return HttpResponse.json({ message: 'Invalid entityId' }, { status: 400 });
    }

    const findFile = await db.uploads.where('entityId').equals(entityId).first();
    if (!findFile) {
      return HttpResponse.json({ message: "You haven't uploaded a photo yet" }, { status: 200 });
    }

    return HttpResponse.json(findFile, { status: 200 });
  }),
];
