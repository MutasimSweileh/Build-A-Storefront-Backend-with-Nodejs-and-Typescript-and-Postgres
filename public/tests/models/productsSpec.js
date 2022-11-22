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
const Products_1 = require("../../models/Products");
const product = new Products_1.Products();
describe('Product model tests', () => {
    const values = { id: 0, name: 'test product', price: 100, category: 'test' };
    it('should create new product', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield product.create(values);
        expect(res.id).toBeTruthy();
        values.id = res.id || 0;
    }));
    it('should return all products', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield product.index();
        expect(res.length).toBeGreaterThan(0);
    }));
    it('should return product', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield product.show(values.id + '');
        expect(res).toEqual(values);
    }));
    it('should update product', () => __awaiter(void 0, void 0, void 0, function* () {
        values.name = 'new test product';
        const res = yield product.update(values.id, values);
        expect(res.name).toBe('new test product');
        values.name = res.name;
    }));
    it('should delete product', () => __awaiter(void 0, void 0, void 0, function* () {
        yield product.delete(values.id);
        const res = yield product.show(values.id + '');
        expect(res).toEqual({});
    }));
});
