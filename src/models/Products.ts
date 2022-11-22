import Client from '../db';
import cleanProperties from './protectProperties';
export type Product = {
  id?: number;
  name: string;
  price: number;
  category?: string;
};
export class Products extends cleanProperties {
  async index(): Promise<Product[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products';
      const result = await conn.query(sql);
      conn.release();
      return this.cleanProperties(result.rows);
    } catch (err) {
      throw new Error(`Could not get products. Error: ${err}`);
    }
  }
  async show(id: string | number): Promise<Product> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      if (result.rows.length < 1) return <Product>{};
      return this.cleanProperties(result.rows[0]);
    } catch (err) {
      throw new Error(`Could not find Product ${id}. Error: ${err}`);
    }
  }

  async update(id: number, b: Product): Promise<Product> {
    try {
      const sql =
        'UPDATE products SET name=$1, price=$2,category=$3 where id=$4 RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, [b.name, b.price, b.category, id]);
      const Product = this.cleanProperties(result.rows[0]);
      conn.release();
      return Product;
    } catch (err) {
      throw new Error(`Could not update Product ${b.name}. Error: ${err}`);
    }
  }
  async create(u: Product): Promise<Product> {
    try {
      const sql =
        'INSERT INTO products (name, price,category) VALUES($1, $2, $3) RETURNING *';
      const conn = await Client.connect();
      //const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds));
      const result = await conn.query(sql, [u.name, u.price, u.category]);
      const Product = this.cleanProperties(result.rows[0]);
      conn.release();
      return Product;
    } catch (err) {
      throw new Error(`Could not add new Product ${u.name}. Error: ${err}`);
    }
  }

  async delete(id: string | number): Promise<Product> {
    try {
      const sql = 'DELETE FROM products WHERE id=($1) RETURNING *';
      const conn = await Client.connect();
      const result = await this.show(id);
      await conn.query(sql, [id]);
      conn.release();
      //if (result.rows.length < 1) return <Product>{};
      return result;
    } catch (err) {
      throw new Error(`Could not delete Product ${id}. Error: ${err}`);
    }
  }
  async productsByCategory(category: string): Promise<Product> {
    try {
      const sql = 'SELECT * FROM products WHERE category=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [category]);
      conn.release();
      if (result.rows.length < 1) return <Product>{};
      return this.cleanProperties(result.rows[0]);
    } catch (err) {
      throw new Error(`Could not find products by category ${category}. Error: ${err}`);
    }
  }
}
