import { http, HttpResponse } from 'msw';
import { RegisterRequest } from '../../app/features/auth/models/register-request.model';
import { userMockService } from '../indexed-db/services/user.mock-db.service';
import { db } from '../indexed-db/app.db';
import { LoginRequest } from '../../app/features/auth/models/login-request.model';
import { LoginResponse } from '../../app/features/auth/models/login-response.model';
import { decrypt, encrypt } from '../utils/crypto';

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

    const userId = findByEmail.id;
    const encryptedUserId = encrypt(userId);
    const result: LoginResponse = {
      accessToken: encryptedUserId,
      user: findByEmail,
    };

    return HttpResponse.json(result, { status: 200 });
  }),

  http.get('/api/auth/profile', async ({ request }) => {
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

    return HttpResponse.json(user, { status: 200 });
  }),
];
