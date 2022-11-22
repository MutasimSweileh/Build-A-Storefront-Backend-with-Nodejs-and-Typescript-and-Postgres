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
Object.defineProperty(exports, "__esModule", { value: true });
const Orders_1 = require("../../models/Orders");
const Products_1 = require("../../models/Products");
const order = new Orders_1.Orders();
const product = new Products_1.Products();
describe('Order model tests', () => {
    const values = {
        id: 0,
        status: 'active',
        products: [{ product_id: 1, quantity: 20 }],
        user_id: 1
    };
    it('should create new product for the order', () => __awaiter(void 0, void 0, void 0, function* () {
        //console.log('token', auth);
        const res = yield product.create({
            id: 0,
            name: 'test product',
            price: 100,
            category: 'test'
        });
        expect(res.id).toBeTruthy();
        values.products[0].product_id = res.id || 0;
    }));
    it('should create new order', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield order.create(values);
        expect(res.id).toBeTruthy();
        values.id = res.id || 0;
    }));
    it('should return all orders', () => __awaiter(void 0, void 0, void 0, function* () {
        const orders = yield order.index();
        expect(orders === null || orders === void 0 ? void 0 : orders.length).toBeGreaterThan(0);
    }));
    it('should return order', () => __awaiter(void 0, void 0, void 0, function* () {
        const orderObj = yield order.show(values.id);
        expect(orderObj === null || orderObj === void 0 ? void 0 : orderObj.id).toEqual(values.id);
        expect(orderObj === null || orderObj === void 0 ? void 0 : orderObj.status).toEqual(values.status);
        expect(((orderObj === null || orderObj === void 0 ? void 0 : orderObj.products) || []).length).toEqual(values.products.length);
    }));
    it('should return order by user_id', () => __awaiter(void 0, void 0, void 0, function* () {
        const orders = yield order.getByUserId(values.user_id);
        expect(orders === null || orders === void 0 ? void 0 : orders.length).toBeGreaterThan(0);
    }));
    it('should update order', () => __awaiter(void 0, void 0, void 0, function* () {
        values.status = 'completed';
        const res = yield order.update(values.id, values);
        expect(res.status).toBe('completed');
        values.status = res.status;
    }));
    it('should delete order', () => __awaiter(void 0, void 0, void 0, function* () {
        yield order.delete(values.id);
        const res = yield order.show(values.id);
        expect(res).toEqual({});
    }));
});
