import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../app';
import config from '../../config';
import { getAuth } from '../helpers/getAuth';
import { User } from '../../models/Users';

describe('User API Tests', () => {
  beforeAll(async () => {
    auth = await getAuth(request);
  });

  let auth: [string, string];
  let id: string;
  const request = supertest(app);
  const user = {
    username: 'test',
    firstname: 'test',
    lastname: 'user',
    password: 'secret'
  };

  it('should create new user and verify token', async () => {
    const res = await request
      .post('/users/')
      .set(...auth)
      .send(user);
    expect(res.status).toBe(200);
    expect(res.body.data.username).toBe(user.username);
    expect(res.body.data.token).toBeTruthy();
    id = res.body.data.id;
  });

  it('should be able to login and verify token', async () => {
    const res = await request
      .post('/login/')
      .send({ username: user.username, password: user.password });
    expect(res.status).toBe(200);
    expect(res.body.data).toBeTruthy();
    const decoded = jwt.verify(
      res.body.data.token,
      config.tokenSecret as unknown as string
    );
    expect((decoded as { u: User }).u.username).toBe(user.username);
  });

  it('should get list of users', async () => {
    const res = await request.get('/users/').set(...auth);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(0);
  });

  it('should get user info', async () => {
    const res = await request.get(`/users/${id}`).set(...auth);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(id);
  });
  it('should be unable to update user info {invalid args}', async () => {
    user.firstname = 'super test';
    const res = await request
      .put(`/users/${id}`)
      .set(...auth)
      .send({});
    expect(res.status).toBe(500);
  });
  it('should update user info', async () => {
    user.firstname = 'super test';
    const res = await request
      .put(`/users/${id}`)
      .set(...auth)
      .send(user);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(id);
    expect(res.body.data.firstname).toBe(user.firstname);
  });

  it('should delete user', async () => {
    const res = await request.delete(`/users/${id}`).set(...auth);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(id);
  });
});
