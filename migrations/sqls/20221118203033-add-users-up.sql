/* Replace with your SQL commands */
/*CREATE EXTENSION IF NOT EXISTS "uuid-ossp";*/
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(300) NOT NULL UNIQUE,
    firstname VARCHAR(300) NOT NULL,
    lastname VARCHAR(300) NOT NULL,
    password VARCHAR(300) NOT NULL,
    "active" INTEGER DEFAULT 0
);

INSERT INTO users (username,firstname, password, lastname) VALUES ('root','root','root','root');