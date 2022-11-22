# Storefront Backend Project

# Project Title

A StoreFront backend API written in NodeJS & PostgresSQL. This application has APIs for Users, Products, and Orders.

### Installing

Simply, run the following command to install the project dependencies:

```bash
npm install
```

### Setup environment

First, create a `.env` file with all the required environment variables:

```bash
PORT=3000
# Set your database connection information here
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=store
POSTGRES_USER=postgres
POSTGRES_PASSWORD=test1245667
ROOT_USER_PASSWORD=test1245667
# authentication
BCRYPT_PASSWORD=your-secret-password
SALT_ROUNDS=10
TOKEN_SECRET=your-secret-token
```

Next, start the Postgres server on Docker:

```bash
docker-compose up
```

Now, check if Postgres has the database `store`, if not create it:

```bash
# Connect to Postgres container
docker exec -it <postgres_container_id> bash

# Login to Postgres
psql -U postgres

# Postgres shell
# This will list out all the databases
\l

# If "store" database is not present
create database store;
```

Next, you need to run the database migrations:

```bash
npm run migration:up
```

## Running the application

Use the following command to run the application in watch mode:

```bash
npm run watch
```

Use the following command to run the application in using node:

```bash
npm run start
```

The application will run on http://localhost:3000/.

**\*Note:** On the first run, the application will create the following root user which you can use to create more users:\*

```json
{
  "password": "{process.env.ROOT_USER_PASSWORD}",
  "username": "root",
  "firstname": "root",
  "lastname": "root"
}
```

## Running the unit tests

Use the following command to run the unit tests:

```bash
npm run test
```

You may also use the Postman collection present in the repository for testing.

## Built With

- [NodeJS](https://nodejs.org/) - The JavaScript runtime
- [NpmJS](https://npmjs.com/) - The dependency manager
- [db-migrate](https://db-migrate.readthedocs.io/en/latest/) - The database migration tool
- [Express](https://expressjs.com) - The web framework
- [TypeScript](https://www.typescriptlang.org/) - Types JS extension
- [Jasmine](https://jasmine.github.io/) - The unit testing framework

## Acknowledgments

- The official documentation of `db-migrate`
- The official Documentation of `Jasmine`
