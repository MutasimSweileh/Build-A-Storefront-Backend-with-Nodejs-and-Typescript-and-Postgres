import { Product, Products } from '../../models/Products';

const product = new Products();

describe('Product model tests', () => {
  const values: Product = { id: 0, name: 'test product', price: 100, category: 'test' };

  it('should create new product', async () => {
    const res = await product.create(values);
    expect(res.id).toBeTruthy();
    values.id = res.id || 0;
  });

  it('should return all products', async () => {
    const res = await product.index();
    expect(res.length).toBeGreaterThan(0);
  });

  it('should return product', async () => {
    const res = await product.show(values.id + '');
    expect(res).toEqual(values);
  });

  it('should update product', async () => {
    values.name = 'new test product';
    const res = await product.update(values.id as number, values);
    expect(res.name).toBe('new test product');
    values.name = res.name;
  });

  it('should delete product', async () => {
    await product.delete(values.id as number);
    const res = await product.show(values.id + '');
    expect(res).toEqual(<Product>{});
  });
});
