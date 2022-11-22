# API and DB Information

## API Endpoints

#### Login

- POST "/login/"
  Send username and password to get an authentication token.

```
Request Data: { username: string, password: string }
Response Body: User data and JWT Token
```

#### Products

- POST "/products/" (Required Authorization Header)
  Create a new product by sending its name and price.

```
Request Data: { name: string, price: number, category: string  }
Response Body: { id: number, name: string, price: number, category: string }
```

- GET "/products/"
  Receive a list of all the products in the database.

```
Response Body: [{ id: number, name: string, price: number, category: string }]
```

- GET "/product/:id/"
  Receive details of a product using its id.

```
Response Body: { id: number, name: string, price: number, category: string }
```

- PUT "/products/:id/" (Required Authorization Header)
  Update a product in the database using its id.

```
Request Data: { id: number, name: string, price: number, category: string }
Response Body: { id: number, name: string, price: number, category: string }
```

- DELETE "/products/:id/" (Required Authorization Header)
  Remove a product from the database using its id.

```
Response Body: { id: number, name: string, price: number, category: string }
```

#### Users

- POST "/users/" (Required Authorization Header)
  Create a new user by sending its username, firstname, lastname, password.

```
Request Data: { username: string, firstname: string, lastname: string, password: string}
Response Body: { id: number,username: string, firstname: string, lastname: string}
```

- GET "/users/" (Required Authorization Header)
  Receive a list of all the users in the database.

```
Response Body: [{ id: number,username: string, firstname: string, lastname: string}]
```

- GET "/users/:id/" (Required Authorization Header)
  Receive a user's details using its id.

```
Response Body: { id: number,username: string, firstname: string, lastname: string }
```

- PUT "/users/:id/" (Required Authorization Header)
  Update a user in the database using its id.

```
Request Data: { id: number,username: string, firstname: string, lastname: string }
Response Body: { id: number,username: string, firstname: string, lastname: string }
```

- DELETE "/users/:id/" (Required Authorization Header)
  Remove a user from the database using its id.

```
Response Body: { id: number,username: string, firstname: string, lastname: string }
```

#### Orders

- POST "/orders/" (Required Authorization Header)
  Create an order by sending its status, list of products and the user_id for the order.

```
Request Data: { status: string, products: [{ product_id: number, quantity: number }], user_id: string }
Response Body: { id: number, status: string, user_id: string }
```

- POST "/orders/:id/product/" (Required Authorization Header)
  Add an product to an order and the id for the order.

```
Request Data: { id: number, product_id: number, quantity: number }
Response Body: { id: number,quantity: number, product_id: number}
```

- GET "/orders/" (Required Authorization Header)
  Receive a list of all the orders in the database.

```
Response Body: [{ id: number, status: string, products: [{ product_id: number, quantity: number }], user_id: string }]
```

- GET "/orders/:id/" (Required Authorization Header)
  Receive details of an order using its id.

```
Response Body: { id: number, status: string, products: [{ product_id: number, quantity: number }], user_id: string }
```

- GET "/orders/user/:user_id/" (Required Authorization Header)
  Receive all the orders for a user using its user_id.

```
Response Body: [{ id: number, status: string, products: [{ product_id: number, quantity: number }], user_id: string }]
```

- GET "/orders/" (Required Authorization Header)
  Receive all the orders for the user making the request.

```
Response Body: [{ id: number, status: string, products: [{ product_id: number, quantity: number }], user_id: string }]
```

- PUT "/orders/" (Required Authorization Header)
  Update an order in the database using its id.

```
Request Data: { id: number, status: string, products: number[], quantities: number[], user_id: string }
Response Body: { id: number, status: string, products: number[], quantities: number[], user_id: string }
```

- DELETE "/orders/" (Required Authorization Header)
  Remove an order from the database using its id.

```
Response Body: { id: number, status: string, user_id: string }
```

#### Dashboard

- GET "/dashboard/products_in_orders/" (Required Authorization Header)
  Get all products that have been included in orders.

```
Response Body: { name: string, price: number, order_id: number}
```

- GET "/dashboard/users-with-orders/" (Required Authorization Header)
  Get all users that have made orders.

```
Response Body: [{firstname: string, lastname: string}]
```

## Database Schema

```postgresql


CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(300) NOT NULL,
    price integer,
    category VARCHAR(300) NOT NULL,
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(300) NOT NULL UNIQUE,
    firstname VARCHAR(300) NOT NULL,
    lastname VARCHAR(300) NOT NULL,
    password VARCHAR(300) NOT NULL,
    active INTEGER DEFAULT 0
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(15),
    user_id bigint REFERENCES users(id)
);

CREATE TABLE order_products (
    id SERIAL PRIMARY KEY,
    quantity integer,
    order_id bigint REFERENCES orders(id),
    product_id bigint REFERENCES products(id)
);
```

## Data Shapes

```
Product
- id: number
- name: string
- price: number

User
- id: string
- username: string
- firstname: string
- lastname: string
- password: string

Order
- id: number
- status: string
- products: [{ product_id: number, quantity: number }]
- user_id: string
```
