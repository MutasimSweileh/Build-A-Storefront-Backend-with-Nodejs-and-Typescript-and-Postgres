import { Pool } from 'pg';
import config from './config';

const db = new Pool({
  host: config.host,
  database: config.database,
  user: config.user,
  password: config.password,
  port: parseInt(config.dbPort as string)
});

db.on('error', er => console.log(er.message));
export default db;
