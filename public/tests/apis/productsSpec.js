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
const app_1 = __importDefault(require("../../app"));
const getAuth_1 = require("../helpers/getAuth");
describe('Product API Tests', () => {
    let auth;
    const request = (0, supertest_1.default)(app_1.default);
    const product = { name: 'test', price: 20, category: 'test' };
    let id;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        auth = yield (0, getAuth_1.getAuth)(request);
    }));
    it('should create new product {invalid args}', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request
            .post('/products/')
            .set(...auth)
            .send({});
        expect(res.status).toBe(500);
    }));
    it('should create new product', () => __awaiter(void 0, void 0, void 0, function* () {
        //console.log('token', auth);
        const res = yield request
            .post('/products/')
            .set(...auth)
            .send(product);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBeTruthy();
        id = res.body.data.id;
    }));
    it('should get list of products', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request.get('/products/');
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThanOrEqual(0);
    }));
    it('should get product info', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request.get(`/products/${id}`);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(id);
    }));
    it('should update product info', () => __awaiter(void 0, void 0, void 0, function* () {
        product.name = 'new name';
        product.price = 100;
        const res = yield request
            .put(`/products/${id}`)
            .set(...auth)
            .send(product);
        expect(res.status).toBe(200);
        expect(res.body.data).toEqual(Object.assign({ id }, product));
    }));
    it('should delete product', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request.delete(`/products/${id}`).set(...auth);
        expect(res.status).toBe(200);
        expect(res.body.data).toEqual(Object.assign({ id }, product));
    }));
});
