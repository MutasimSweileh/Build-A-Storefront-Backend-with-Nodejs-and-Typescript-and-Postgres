import { Order, Orders } from '../../models/Orders';
import { Products } from '../../models/Products';

const order = new Orders();
const product = new Products();

describe('Order model tests', () => {
  const values = {
    id: 0,
    status: 'active',
    products: [{ product_id: 1, quantity: 20 }],
    user_id: 1
  };
  it('should create new product for the order', async () => {
    //console.log('token', auth);
    const res = await product.create({
      id: 0,
      name: 'test product',
      price: 100,
      category: 'test'
    });
    expect(res.id).toBeTruthy();
    values.products[0].product_id = res.id || 0;
  });
  it('should create new order', async () => {
    const res = await order.create(values);
    expect(res.id).toBeTruthy();
    values.id = res.id || 0;
  });

  it('should return all orders', async () => {
    const orders = await order.index();
    expect(orders?.length).toBeGreaterThan(0);
  });

  it('should return order', async () => {
    const orderObj = await order.show(values.id);
    expect(orderObj?.id).toEqual(values.id);
    expect(orderObj?.status).toEqual(values.status);
    expect((orderObj?.products || []).length).toEqual(values.products.length);
  });

  it('should return order by user_id', async () => {
    const orders = await order.getByUserId(values.user_id);
    expect(orders?.length).toBeGreaterThan(0);
  });

  it('should update order', async () => {
    values.status = 'completed';
    const res = await order.update(values.id, values);
    expect(res.status).toBe('completed');
    values.status = res.status;
  });

  it('should delete order', async () => {
    await order.delete(values.id);
    const res = await order.show(values.id);
    expect(res).toEqual(<Order>{});
  });
});
