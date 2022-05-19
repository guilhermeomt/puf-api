import request from 'supertest';
import { app } from './app';

const server = app.listen();

describe('Users routes', () => {
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

    console.log(response);

    expect(response.status).toBe(404);
  });
});
