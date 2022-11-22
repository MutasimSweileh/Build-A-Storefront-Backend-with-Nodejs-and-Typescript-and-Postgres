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
const express_1 = require("express");
const Orders_1 = require("../models/Orders");
const order = new Orders_1.Orders();
const router = (0, express_1.Router)();
const index = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order.index();
        res.json({
            status: 'success',
            data: orders
        });
    }
    catch (err) {
        next(err);
    }
});
const show = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Order = yield order.show(req.params.id);
        res.json({
            status: 'success',
            data: Order
        });
    }
    catch (err) {
        next(err);
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Order = {
            products: req.body.products,
            status: req.body.status,
            user_id: req.body.user_id
        };
        const newOrder = yield order.create(Order);
        res.json({
            status: 'success',
            data: newOrder
        });
    }
    catch (err) {
        next(err);
    }
});
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const Order = {
            status: req.body.status
        };
        const newOrder = yield order.update(id, Order);
        res.json({
            status: 'success',
            data: newOrder
        });
    }
    catch (err) {
        next(err);
    }
});
const destroy = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield order.delete(req.params.id);
        res.json({
            status: 'success',
            data: deleted
        });
    }
    catch (err) {
        next(err);
    }
});
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    const productId = req.body.productId;
    const quantity = parseInt(req.body.quantity);
    try {
        const addedProduct = yield order.addProduct(quantity, orderId, productId);
        res.json(addedProduct);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
});
const ordersByUserID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order.getByUserId(req.params.id);
        res.json({
            status: 'success',
            data: orders
        });
    }
    catch (err) {
        next(err);
    }
});
router.get('/orders', index);
router.get('/orders/:id', show);
router.post('/orders', create);
router.put('/orders/:id', update);
router.delete('/orders/:id', destroy);
router.post('/orders/:id/product', addProduct);
router.get('/orders/user/:id', ordersByUserID);
exports.default = router;
