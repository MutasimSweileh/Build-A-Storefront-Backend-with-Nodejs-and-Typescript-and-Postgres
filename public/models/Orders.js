"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orders = exports.status = void 0;
const db_1 = __importDefault(require("../db"));
const pg_format_1 = __importDefault(require("pg-format"));
const protectProperties_1 = __importDefault(require("./protectProperties"));
var status;
(function (status) {
    status[status["active"] = 0] = "active";
    status[status["complete"] = 1] = "complete";
})(status = exports.status || (exports.status = {}));
class Orders extends protectProperties_1.default {
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield db_1.default.connect();
                const sql = 'SELECT o.*, array_agg(row_to_json(op)) as products FROM orders o JOIN order_products op ON o.id = op.order_id GROUP BY o.id';
                const result = yield conn.query(sql);
                conn.release();
                return this.cleanProperties(result.rows);
            }
            catch (err) {
                throw new Error(`Could not get orders. Error: ${err}`);
            }
        });
    }
    show(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = 'SELECT o.*, array_agg(row_to_json(op)) as products FROM orders o JOIN order_products op ON o.id = op.order_id WHERE o.id = $1 GROUP BY o.id';
                const conn = yield db_1.default.connect();
                const result = yield conn.query(sql, [id]);
                conn.release();
                if (result.rows.length < 1)
                    return {};
                return result.rows[0];
            }
            catch (err) {
                throw new Error(`Could not find Order ${id}. Error: ${err}`);
            }
        });
    }
    update(id, b) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = 'UPDATE orders SET status=$1 where id=$2 RETURNING *';
                const conn = yield db_1.default.connect();
                yield conn.query(sql, [b.status, id]);
                //const Order = this.cleanProperties(result.rows[0]);
                conn.release();
                const Order = this.show(`${id}`);
                return Order;
            }
            catch (err) {
                throw new Error(`Could not update Order ${b.status}. Error: ${err}`);
            }
        });
    }
    create(u) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = 'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *';
                const conn = yield db_1.default.connect();
                //const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds));
                const result = yield conn.query(sql, [u.status, u.user_id]);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const products = u.products.map(product => [
                    result.rows[0].id,
                    product.product_id,
                    product.quantity
                ]);
                yield conn.query((0, pg_format_1.default)('INSERT INTO order_products(order_id, product_id, quantity) VALUES %L', products));
                const Order = this.cleanProperties(result.rows[0]);
                conn.release();
                return Order;
            }
            catch (err) {
                throw new Error(`Could not add new Order ${u.status}. Error: ${err}`);
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = 'DELETE FROM orders WHERE id=($1) RETURNING *';
                const conn = yield db_1.default.connect();
                const result = yield this.show(id);
                yield conn.query('DELETE FROM order_products WHERE order_id = $1', [id]);
                yield conn.query(sql, [id]);
                conn.release();
                return result;
            }
            catch (err) {
                throw new Error(`Could not delete Order ${id}. Error: ${err}`);
            }
        });
    }
    ordersByUserID(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = 'SELECT * FROM orders WHERE user_id=($1)';
                const conn = yield db_1.default.connect();
                const result = yield conn.query(sql, [user_id]);
                conn.release();
                if (result.rows.length < 1)
                    return {};
                return this.cleanProperties(result.rows[0]);
            }
            catch (err) {
                throw new Error(`Could not find any orders by user id ${user_id}. Error: ${err}`);
            }
        });
    }
    getByUserId(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = 'SELECT o.*, array_agg(row_to_json(op)) as products FROM orders o JOIN order_products op ON o.id = op.order_id WHERE o.user_id = $1 GROUP BY o.id';
                const conn = yield db_1.default.connect();
                const result = yield conn.query(sql, [user_id]);
                conn.release();
                return this.cleanProperties(result.rows);
            }
            catch (e) {
                throw new Error(`Error fetching orders with user_id: ${user_id}. Error: ${e}`);
            }
        });
    }
    addProduct(quantity, orderId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            // get order to see if it is open
            try {
                const ordersql = 'SELECT * FROM orders WHERE id=($1)';
                const conn = yield db_1.default.connect();
                const result = yield conn.query(ordersql, [orderId]);
                const order = result.rows[0];
                if (order.status !== 'open') {
                    throw new Error(`Could not add product ${productId} to order ${orderId} because order status is ${order.status}`);
                }
                conn.release();
            }
            catch (err) {
                throw new Error(`${err}`);
            }
            try {
                const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
                const conn = yield db_1.default.connect();
                const result = yield conn.query(sql, [quantity, orderId, productId]);
                const order = result.rows[0];
                conn.release();
                return order;
            }
            catch (err) {
                throw new Error(`Could not add product ${productId} to order ${orderId}: ${err}`);
            }
        });
    }
}
exports.Orders = Orders;
