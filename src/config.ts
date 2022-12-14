import dotenv from 'dotenv';
dotenv.config();

const {
  PORT,
  NODE_ENV,
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_DB_TEST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  BCRYPT_PASSWORD,
  TOKEN_SECRET,
  SALT_ROUNDS
} = process.env;

export default {
  port: PORT,
  host: POSTGRES_HOST,
  dbPort: POSTGRES_PORT,
  database: NODE_ENV === 'dev' ? POSTGRES_DB : POSTGRES_DB_TEST,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  pepper: BCRYPT_PASSWORD,
  salt: SALT_ROUNDS,
  tokenSecret: TOKEN_SECRET
};
