import Client from '../db';
import config from '../config';
import bcrypt from 'bcrypt';
import cleanProperties from './protectProperties';
export type User = {
  id?: number;
  username: string;
  firstname: string;
  lastname: string;
  password?: string;
};
const hashPassword = (password: string) => {
  const salt = parseInt(config.salt as string, 10);
  return bcrypt.hashSync(`${password}${config.pepper}`, salt);
};
const isPasswordValid = (password: string, hashPassword: string | undefined) => {
  if (!hashPassword) return false;
  return bcrypt.compareSync(`${password}${config.pepper}`, hashPassword);
};
export async function createRootUser() {
  const password = process.env.ROOT_USER_PASSWORD || 'password';
  try {
    const rootUser = new Users();
    const grootUser = await rootUser.show('1', false);
    if (isPasswordValid(password, grootUser.password)) return;
    await rootUser.update(1, {
      username: 'root',
      firstname: 'root',
      lastname: 'root',
      password: password
    });
  } catch (e) {
    console.log('Error creating the root user:', e);
  }
}

export class Users extends cleanProperties {
  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users';
      const result = await conn.query(sql);
      conn.release();
      return this.cleanProperties(result.rows);
    } catch (err) {
      throw new Error(`Could not get Users. Error: ${err}`);
    }
  }
  async show(id: string, clear: boolean = true): Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      if (result.rows.length < 1) return <User>{};
      if (clear) return this.cleanProperties(result.rows[0]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find User ${id}. Error: ${err}`);
    }
  }
  async authenticate(username: string, password: string): Promise<User | null> {
    try {
      const connection = await Client.connect();
      const sql = 'SELECT password FROM users WHERE username=$1';
      const result = await connection.query(sql, [username]);
      //console.log(sql, result);
      if (result.rows.length) {
        const { password: hashPassword } = result.rows[0];
        const isPasswordValid = bcrypt.compareSync(
          `${password}${config.pepper}`,
          hashPassword
        );
        if (isPasswordValid) {
          const userInfo = await connection.query(
            'SELECT * FROM users WHERE username=($1)',
            [username]
          );
          return this.cleanProperties(userInfo.rows[0]);
        }
      }
      connection.release();
      return null;
    } catch (error) {
      throw new Error(`Unable to login: ${(error as Error).message}`);
    }
  }
  async update(id: number, b: User): Promise<User> {
    try {
      const sql =
        'UPDATE users SET username=$1,firstname=$2, password=$3,lastname=$4 where id=$5 RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, [
        b.username,
        b.firstname,
        hashPassword(b.password as string),
        b.lastname,
        id
      ]);
      const User = this.cleanProperties(result.rows[0]);
      conn.release();
      return User;
    } catch (err) {
      throw new Error(`Could not update User ${b.username}. Error: ${err}`);
    }
  }
  async create(u: User): Promise<User> {
    try {
      const sql =
        'INSERT INTO users (username,firstname, password, lastname) VALUES($1, $2, $3,$4) RETURNING *';
      const conn = await Client.connect();
      //const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds));
      const result = await conn.query(sql, [
        u.username,
        u.firstname,
        hashPassword(u.password as string),
        u.lastname
      ]);
      const User = this.cleanProperties(result.rows[0]);
      conn.release();
      return User;
    } catch (err) {
      throw new Error(`Could not add new User ${u.firstname}. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<User> {
    try {
      const sql = 'DELETE FROM users WHERE id=($1) RETURNING *';
      const conn = await Client.connect();
      const result = await this.show(id);
      await conn.query(sql, [id]);
      conn.release();
      //if (result.rows.length < 1) return <User>{};
      return result;
    } catch (err) {
      throw new Error(`Could not delete User ${id}. Error: ${err}`);
    }
  }
}
createRootUser();
