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
exports.Users = exports.createRootUser = void 0;
const db_1 = __importDefault(require("../db"));
const config_1 = __importDefault(require("../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const protectProperties_1 = __importDefault(require("./protectProperties"));
const hashPassword = (password) => {
    const salt = parseInt(config_1.default.salt, 10);
    return bcrypt_1.default.hashSync(`${password}${config_1.default.pepper}`, salt);
};
const isPasswordValid = (password, hashPassword) => {
    if (!hashPassword)
        return false;
    return bcrypt_1.default.compareSync(`${password}${config_1.default.pepper}`, hashPassword);
};
function createRootUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const password = process.env.ROOT_USER_PASSWORD || 'password';
        try {
            const rootUser = new Users();
            const grootUser = yield rootUser.show('1', false);
            if (isPasswordValid(password, grootUser.password))
                return;
            yield rootUser.update(1, {
                username: 'root',
                firstname: 'root',
                lastname: 'root',
                password: password
            });
        }
        catch (e) {
            console.log('Error creating the root user:', e);
        }
    });
}
exports.createRootUser = createRootUser;
class Users extends protectProperties_1.default {
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield db_1.default.connect();
                const sql = 'SELECT * FROM users';
                const result = yield conn.query(sql);
                conn.release();
                return this.cleanProperties(result.rows);
            }
            catch (err) {
                throw new Error(`Could not get Users. Error: ${err}`);
            }
        });
    }
    show(id, clear = true) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = 'SELECT * FROM users WHERE id=($1)';
                const conn = yield db_1.default.connect();
                const result = yield conn.query(sql, [id]);
                conn.release();
                if (result.rows.length < 1)
                    return {};
                if (clear)
                    return this.cleanProperties(result.rows[0]);
                return result.rows[0];
            }
            catch (err) {
                throw new Error(`Could not find User ${id}. Error: ${err}`);
            }
        });
    }
    authenticate(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield db_1.default.connect();
                const sql = 'SELECT password FROM users WHERE username=$1';
                const result = yield connection.query(sql, [username]);
                //console.log(sql, result);
                if (result.rows.length) {
                    const { password: hashPassword } = result.rows[0];
                    const isPasswordValid = bcrypt_1.default.compareSync(`${password}${config_1.default.pepper}`, hashPassword);
                    if (isPasswordValid) {
                        const userInfo = yield connection.query('SELECT * FROM users WHERE username=($1)', [username]);
                        return this.cleanProperties(userInfo.rows[0]);
                    }
                }
                connection.release();
                return null;
            }
            catch (error) {
                throw new Error(`Unable to login: ${error.message}`);
            }
        });
    }
    update(id, b) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = 'UPDATE users SET username=$1,firstname=$2, password=$3,lastname=$4 where id=$5 RETURNING *';
                const conn = yield db_1.default.connect();
                const result = yield conn.query(sql, [
                    b.username,
                    b.firstname,
                    hashPassword(b.password),
                    b.lastname,
                    id
                ]);
                const User = this.cleanProperties(result.rows[0]);
                conn.release();
                return User;
            }
            catch (err) {
                throw new Error(`Could not update User ${b.username}. Error: ${err}`);
            }
        });
    }
    create(u) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = 'INSERT INTO users (username,firstname, password, lastname) VALUES($1, $2, $3,$4) RETURNING *';
                const conn = yield db_1.default.connect();
                //const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds));
                const result = yield conn.query(sql, [
                    u.username,
                    u.firstname,
                    hashPassword(u.password),
                    u.lastname
                ]);
                const User = this.cleanProperties(result.rows[0]);
                conn.release();
                return User;
            }
            catch (err) {
                throw new Error(`Could not add new User ${u.firstname}. Error: ${err}`);
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = 'DELETE FROM users WHERE id=($1) RETURNING *';
                const conn = yield db_1.default.connect();
                const result = yield this.show(id);
                yield conn.query(sql, [id]);
                conn.release();
                //if (result.rows.length < 1) return <User>{};
                return result;
            }
            catch (err) {
                throw new Error(`Could not delete User ${id}. Error: ${err}`);
            }
        });
    }
}
exports.Users = Users;
createRootUser();
