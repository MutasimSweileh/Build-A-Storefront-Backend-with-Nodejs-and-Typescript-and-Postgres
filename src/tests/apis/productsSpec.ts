import supertest from 'supertest';
import app from '../../app';
import { getAuth } from '../helpers/getAuth';

describe('Product API Tests', () => {
  let auth: [string, string];
  const request = supertest(app);
  const product = { name: 'test', price: 20, category: 'test' };
  let id: number;
  beforeAll(async () => {
    auth = await getAuth(request);
  });
  it('should create new product {invalid args}', async () => {
    const res = await request
      .post('/products/')
      .set(...auth)
      .send({});
    expect(res.status).toBe(500);
  });
  it('should create new product', async () => {
    //console.log('token', auth);
    const res = await request
      .post('/products/')
      .set(...auth)
      .send(product);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBeTruthy();
    id = res.body.data.id;
  });

  it('should get list of products', async () => {
    const res = await request.get('/products/');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(0);
  });

  it('should get product info', async () => {
    const res = await request.get(`/products/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(id);
  });

  it('should update product info', async () => {
    product.name = 'new name';
    product.price = 100;
    const res = await request
      .put(`/products/${id}`)
      .set(...auth)
      .send(product);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({ id, ...product });
  });

  it('should delete product', async () => {
    const res = await request.delete(`/products/${id}`).set(...auth);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({ id, ...product });
  });
});
