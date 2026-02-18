import { http, HttpResponse } from 'msw';
import { RegisterRequest } from '../../app/features/auth/models/register-request.model';
import { userMockService } from '../indexed-db/services/user.mock-db.service';
import { db } from '../indexed-db/app.db';
import { LoginRequest } from '../../app/features/auth/models/login-request.model';
import { LoginResponse } from '../../app/features/auth/models/login-response.model';

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

  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as LoginRequest;

    const [findByEmail, findByPassword] = await Promise.all([
      db.users.where('email').equals(body.email).first(),
      db.users.where('password').equals(body.password).first(),
    ]);

    if (!findByEmail || !findByPassword) {
      return HttpResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    const result: LoginResponse = {
      accessToken: 'dummy-access-token',
      user: findByEmail,
    };

    return HttpResponse.json(result, { status: 200 });
  }),
];
