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
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = __importDefault(require("../../app"));
const config_1 = __importDefault(require("../../config"));
const getAuth_1 = require("../helpers/getAuth");
describe('User API Tests', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        auth = yield (0, getAuth_1.getAuth)(request);
    }));
    let auth;
    let id;
    const request = (0, supertest_1.default)(app_1.default);
    const user = {
        username: 'test',
        firstname: 'test',
        lastname: 'user',
        password: 'secret'
    };
    it('should create new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request
            .post('/users/')
            .set(...auth)
            .send(user);
        expect(res.status).toBe(200);
        expect(res.body.data.username).toBe(user.username);
        id = res.body.data.id;
    }));
    it('should be able to login', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request
            .post('/login/')
            .send({ username: user.username, password: user.password });
        expect(res.status).toBe(200);
        expect(res.body.data).toBeTruthy();
        const decoded = jsonwebtoken_1.default.verify(res.body.data.token, config_1.default.tokenSecret);
        expect(decoded.u.username).toBe(user.username);
    }));
    it('should get list of users', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request.get('/users/').set(...auth);
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThanOrEqual(0);
    }));
    it('should get user info', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request.get(`/users/${id}`).set(...auth);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(id);
    }));
    it('should update user info', () => __awaiter(void 0, void 0, void 0, function* () {
        user.firstname = 'super test';
        const res = yield request
            .put(`/users/${id}`)
            .set(...auth)
            .send(user);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(id);
        expect(res.body.data.firstname).toBe(user.firstname);
    }));
    it('should delete user', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request.delete(`/users/${id}`).set(...auth);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(id);
    }));
});
