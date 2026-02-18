import { http, HttpResponse } from 'msw';
import { RegisterRequest } from '../../app/features/auth/models/register-request.model';
import { userMockService } from '../indexed-db/services/user.mock-db.service';
import { db } from '../indexed-db/app.db';

export const authHandlers = [
  http.post('/api/auth/register', async ({ request }) => {
    const body = (await request.json()) as RegisterRequest;

    const [findByUsername, findByEmail, findByPhoneNumber] = await Promise.all([
      db.users.where('username').equals(body.username).first(),
      db.users.where('email').equals(body.email).first(),
      db.users.where('phoneNumber').equals(body.phoneNumber).first(),
    ]);

    if (findByUsername || findByEmail || findByPhoneNumber) {
      return HttpResponse.json({ message: 'User already exist' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const result = await userMockService.create({
      username: body.username,
      email: body.email,
      phoneNumber: body.phoneNumber,
      fullName: body.fullName,
      roles: ['OWNER'],
      password: body.password,
      createdAt: now,
      updatedAt: null,
      deletedAt: null,
    });

    return HttpResponse.json(result, { status: 201 });
  }),
];
