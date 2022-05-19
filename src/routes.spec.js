import request from 'supertest';
import bcrypt from 'bcrypt';
import { prisma } from '~/data';

import { app } from './app';

const server = app.listen();

const name = 'User';
const email = 'ola@guilhermeomt.dev';
const password = '123456';

describe('Users routes', () => {
  beforeAll(async () => {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    server.close();
  });

  it('should return not found with wrong password', async () => {
    const email = 'ola@guilhermeomt.dev';
    const password = '123';

    const response = await request(server)
      .get('/login')
      .auth(email, password, { type: 'basic' });

    expect(response.status).toBe(404);
  });

  it('should return not found with wrong email', async () => {
    const email = 'errado@gmail.com';
    const password = '123456';

    const response = await request(server)
      .get('/login')
      .auth(email, password, { type: 'basic' });

    expect(response.status).toBe(404);
  });

  it('should return logged in user by correct credentials', async () => {
    const response = await request(server)
      .get('/login')
      .auth(email, password, { type: 'basic' });

    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
    expect(response.body.user.id).toBeTruthy();
    expect(response.body.user.email).toBe(email);
    expect(response.body.user.password).toBeFalsy();
  });
});
