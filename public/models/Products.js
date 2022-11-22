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
exports.Products = void 0;
const db_1 = __importDefault(require("../db"));
const protectProperties_1 = __importDefault(require("./protectProperties"));
class Products extends protectProperties_1.default {
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield db_1.default.connect();
                const sql = 'SELECT * FROM products';
                const result = yield conn.query(sql);
                conn.release();
                return this.cleanProperties(result.rows);
            }
            catch (err) {
                throw new Error(`Could not get products. Error: ${err}`);
            }
        });
    }
    show(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = 'SELECT * FROM products WHERE id=($1)';
                const conn = yield db_1.default.connect();
                const result = yield conn.query(sql, [id]);
                conn.release();
                if (result.rows.length < 1)
                    return {};
                return this.cleanProperties(result.rows[0]);
            }
            catch (err) {
                throw new Error(`Could not find Product ${id}. Error: ${err}`);
            }
        });
    }
    update(id, b) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = 'UPDATE products SET name=$1, price=$2,category=$3 where id=$4 RETURNING *';
                const conn = yield db_1.default.connect();
                const result = yield conn.query(sql, [b.name, b.price, b.category, id]);
                const Product = this.cleanProperties(result.rows[0]);
                conn.release();
                return Product;
            }
            catch (err) {
                throw new Error(`Could not update Product ${b.name}. Error: ${err}`);
            }
        });
    }
    create(u) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = 'INSERT INTO products (name, price,category) VALUES($1, $2, $3) RETURNING *';
                const conn = yield db_1.default.connect();
                //const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds));
                const result = yield conn.query(sql, [u.name, u.price, u.category]);
                const Product = this.cleanProperties(result.rows[0]);
                conn.release();
                return Product;
            }
            catch (err) {
                throw new Error(`Could not add new Product ${u.name}. Error: ${err}`);
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = 'DELETE FROM products WHERE id=($1) RETURNING *';
                const conn = yield db_1.default.connect();
                const result = yield this.show(id);
                yield conn.query(sql, [id]);
                conn.release();
                //if (result.rows.length < 1) return <Product>{};
                return result;
            }
            catch (err) {
                throw new Error(`Could not delete Product ${id}. Error: ${err}`);
            }
        });
    }
    productsByCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = 'SELECT * FROM products WHERE category=($1)';
                const conn = yield db_1.default.connect();
                const result = yield conn.query(sql, [category]);
                conn.release();
                if (result.rows.length < 1)
                    return {};
                return this.cleanProperties(result.rows[0]);
            }
            catch (err) {
                throw new Error(`Could not find products by category ${category}. Error: ${err}`);
            }
        });
    }
}
exports.Products = Products;
