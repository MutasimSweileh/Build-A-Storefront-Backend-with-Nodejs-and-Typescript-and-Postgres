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
const express_1 = require("express");
const Products_1 = require("../models/Products");
const authentication_1 = __importDefault(require("../middleware/authentication"));
const product = new Products_1.Products();
const router = (0, express_1.Router)();
const index = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product.index();
        res.json({
            status: 'success',
            data: products
        });
    }
    catch (err) {
        next(err);
    }
});
const show = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Product = yield product.show(req.params.id);
        res.json({
            status: 'success',
            data: Product
        });
    }
    catch (err) {
        next(err);
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Product = {
            name: req.body.name,
            price: req.body.price,
            category: req.body.category
        };
        const newProduct = yield product.create(Product);
        res.json({
            status: 'success',
            data: newProduct
        });
    }
    catch (err) {
        next(err);
    }
});
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const Product = {
            name: req.body.name,
            price: req.body.price,
            category: req.body.category
        };
        const newProduct = yield product.update(id, Product);
        res.json({
            status: 'success',
            data: newProduct
        });
    }
    catch (err) {
        next(err);
    }
});
const destroy = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield product.delete(req.params.id);
        res.json({
            status: 'success',
            data: deleted
        });
    }
    catch (err) {
        next(err);
    }
});
const productsByCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product.productsByCategory(req.body.category);
        res.json({
            status: 'success',
            data: products
        });
    }
    catch (err) {
        next(err);
    }
});
router.get('/products', index);
router.get('/products/:id', show);
router.post('/product-by-category', productsByCategory);
router.post('/products', authentication_1.default, create);
router.put('/products/:id', authentication_1.default, update);
router.delete('/products/:id', authentication_1.default, destroy);
exports.default = router;
