import Client from '../db';
import format from 'pg-format';

import cleanProperties from './protectProperties';

export type OrderProduct = {
  order_id?: number;
  product_id: number;
  quantity: number;
};
export type Order = {
  id?: number;
  status: string;
  products?: OrderProduct[];
  user_id?: number;
};
export enum status {
  active,
  complete
}
export class Orders extends cleanProperties {
  async index(): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql =
        'SELECT o.*, array_agg(row_to_json(op)) as products FROM orders o JOIN order_products op ON o.id = op.order_id GROUP BY o.id';
      const result = await conn.query(sql);
      conn.release();
      return this.cleanProperties(result.rows);
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`);
    }
  }
  async show(id: string | number): Promise<Order> {
    try {
      const sql =
        'SELECT o.*, array_agg(row_to_json(op)) as products FROM orders o JOIN order_products op ON o.id = op.order_id WHERE o.id = $1 GROUP BY o.id';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      if (result.rows.length < 1) return <Order>{};
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find Order ${id}. Error: ${err}`);
    }
  }

  async update(id: number, b: Order): Promise<Order> {
    try {
      const sql = 'UPDATE orders SET status=$1 where id=$2 RETURNING *';
      const conn = await Client.connect();
      await conn.query(sql, [b.status, id]);
      //const Order = this.cleanProperties(result.rows[0]);
      conn.release();
      const Order = this.show(`${id}`);
      return Order;
    } catch (err) {
      throw new Error(`Could not update Order ${b.status}. Error: ${err}`);
    }
  }
  async create(u: Order): Promise<Order> {
    try {
      const sql = 'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *';
      const conn = await Client.connect();
      //const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds));
      const result = await conn.query(sql, [u.status, u.user_id]);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const products = u.products!.map(product => [
        result.rows[0].id,
        product.product_id,
        product.quantity
      ]);
      await conn.query(
        format(
          'INSERT INTO order_products(order_id, product_id, quantity) VALUES %L',
          products
        )
      );
      const Order = this.cleanProperties(result.rows[0]);
      conn.release();
      return Order;
    } catch (err) {
      throw new Error(`Could not add new Order ${u.status}. Error: ${err}`);
    }
  }

  async delete(id: string | number): Promise<Order> {
    try {
      const sql = 'DELETE FROM orders WHERE id=($1) RETURNING *';
      const conn = await Client.connect();
      const result = await this.show(id);
      await conn.query('DELETE FROM order_products WHERE order_id = $1', [id]);
      await conn.query(sql, [id]);
      conn.release();
      return result;
    } catch (err) {
      throw new Error(`Could not delete Order ${id}. Error: ${err}`);
    }
  }
  async ordersByUserID(user_id: string): Promise<Order> {
    try {
      const sql = 'SELECT * FROM orders WHERE user_id=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [user_id]);
      conn.release();
      if (result.rows.length < 1) return <Order>{};
      return this.cleanProperties(result.rows[0]);
    } catch (err) {
      throw new Error(`Could not find any orders by user id ${user_id}. Error: ${err}`);
    }
  }
  async getByUserId(user_id: string | number): Promise<Order[]> {
    try {
      const sql =
        'SELECT o.*, array_agg(row_to_json(op)) as products FROM orders o JOIN order_products op ON o.id = op.order_id WHERE o.user_id = $1 GROUP BY o.id';
      const conn = await Client.connect();
      const result = await conn.query(sql, [user_id]);
      conn.release();
      return this.cleanProperties(result.rows);
    } catch (e) {
      throw new Error(`Error fetching orders with user_id: ${user_id}. Error: ${e}`);
    }
  }
  async addProduct(quantity: number, orderId: string, productId: string): Promise<Order> {
    // get order to see if it is open
    try {
      const ordersql = 'SELECT * FROM orders WHERE id=($1)';
      const conn = await Client.connect();
      const result = await conn.query(ordersql, [orderId]);
      const order = result.rows[0];
      if (order.status !== 'open') {
        throw new Error(
          `Could not add product ${productId} to order ${orderId} because order status is ${order.status}`
        );
      }
      conn.release();
    } catch (err) {
      throw new Error(`${err}`);
    }
    try {
      const sql =
        'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, [quantity, orderId, productId]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Could not add product ${productId} to order ${orderId}: ${err}`);
    }
  }
}
