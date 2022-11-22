import supertest from 'supertest';
import app from '../../app';
import { getAuth } from '../helpers/getAuth';

describe('Order API Tests', () => {
  beforeAll(async () => {
    auth = await getAuth(request);
  });

  let auth: [string, string];
  let id: number;
  const request = supertest(app);
  const order = {
    status: 'active',
    products: [{ product_id: 1, quantity: 20 }],
    user_id: '1'
  };
  const product = { name: 'test', price: 20, category: 'test' };
  it('should be unable to create a new product without token', async () => {
    const res = await request.post('/products/').send(product);
    expect(res.status).toBe(401);
    expect(res.body.data).toBeFalsy();
  });
  it('should create a new product for the order with token', async () => {
    //console.log('token', auth);
    const res = await request
      .post('/products/')
      .set(...auth)
      .send(product);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBeTruthy();
    order.products[0].product_id = res.body.data.id;
  });

  it('should create new order', async () => {
    const res = await request
      .post('/orders/')
      .set(...auth)
      .send(order);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBeTruthy();
    id = res.body.data.id;
  });

  it('should get list of orders', async () => {
    const res = await request.get('/orders/').set(...auth);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(0);
  });

  it('should get order info', async () => {
    const res = await request.get(`/orders/${id}`).set(...auth);
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe(order.status);
    expect(res.body.data.products.length).toBe(order.products.length);
    order.products = res.body.data.products;
  });

  it('should get list of orders by user_id', async () => {
    const res = await request.get(`/orders/user/${order.user_id}`).set(...auth);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(0);
  });

  it('should get list of self orders', async () => {
    const res = await request.get('/orders/').set(...auth);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(0);
  });

  it('should update order info', async () => {
    order.status = 'completed';
    const res = await request
      .put(`/orders/${id}`)
      .set(...auth)
      .send(order);
    expect(res.status).toBe(200);
    // console.log(res.body);
    expect(res.body.data).toEqual({ id, ...order });
  });

  it('should delete order', async () => {
    const res = await request.delete(`/orders/${id}`).set(...auth);
    expect(res.status).toBe(200);
    //console.log(res.body);
    expect(res.body.data).toEqual({ id, ...order });
  });
});
