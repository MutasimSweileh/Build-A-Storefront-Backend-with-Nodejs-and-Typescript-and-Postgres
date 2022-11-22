import { SuperTest, Test } from 'supertest';
import { createRootUser } from '../../models/Users';

export async function getAuth(request: SuperTest<Test>): Promise<[string, string]> {
  await createRootUser();
  const res = await request
    .post('/login/')
    .send({ username: 'root', password: process.env.ROOT_USER_PASSWORD || 'password' });
  if (res.statusCode !== 200) console.log(res);
  return ['Authorization', `Bearer ${res.body.data.token}`];
}
