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
describe('Order API Tests', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        auth = yield (0, getAuth_1.getAuth)(request);
    }));
    let auth;
    let id;
    const request = (0, supertest_1.default)(app_1.default);
    const order = {
        status: 'active',
        products: [{ product_id: 1, quantity: 20 }],
        user_id: '1'
    };
    const product = { name: 'test', price: 20, category: 'test' };
    it('should create new product for the order', () => __awaiter(void 0, void 0, void 0, function* () {
        //console.log('token', auth);
        const res = yield request
            .post('/products/')
            .set(...auth)
            .send(product);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBeTruthy();
        order.products[0].product_id = res.body.data.id;
    }));
    it('should create new order', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request
            .post('/orders/')
            .set(...auth)
            .send(order);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBeTruthy();
        id = res.body.data.id;
    }));
    it('should get list of orders', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request.get('/orders/').set(...auth);
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThanOrEqual(0);
    }));
    it('should get order info', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request.get(`/orders/${id}`).set(...auth);
        expect(res.status).toBe(200);
        expect(res.body.data.status).toBe(order.status);
        expect(res.body.data.products.length).toBe(order.products.length);
        order.products = res.body.data.products;
    }));
    it('should get list of orders by user_id', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request.get(`/orders/user/${order.user_id}`).set(...auth);
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThanOrEqual(0);
    }));
    it('should get list of self orders', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request.get('/orders/').set(...auth);
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThanOrEqual(0);
    }));
    it('should update order info', () => __awaiter(void 0, void 0, void 0, function* () {
        order.status = 'completed';
        const res = yield request
            .put(`/orders/${id}`)
            .set(...auth)
            .send(order);
        expect(res.status).toBe(200);
        // console.log(res.body);
        expect(res.body.data).toEqual(Object.assign({ id }, order));
    }));
    it('should delete order', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request.delete(`/orders/${id}`).set(...auth);
        expect(res.status).toBe(200);
        //console.log(res.body);
        expect(res.body.data).toEqual(Object.assign({ id }, order));
    }));
});
