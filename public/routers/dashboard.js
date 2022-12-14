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
const dashboard_1 = require("../services/dashboard");
const router = (0, express_1.Router)();
const dashboard = new dashboard_1.Dashboard();
const productsInOrders = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield dashboard.productsInOrders();
        res.json(products);
    }
    catch (err) {
        return next(err);
    }
});
const usersWithOrders = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield dashboard.usersWithOrders();
        res.json(users);
    }
    catch (err) {
        return next(err);
    }
});
const fiveMostExpensive = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield dashboard.fiveMostExpensive();
        res.json(users);
    }
    catch (err) {
        return next(err);
    }
});
router.get('/products_in_orders', productsInOrders);
router.get('/users-with-orders', usersWithOrders);
router.get('/five-most-expensive', fiveMostExpensive);
exports.default = router;
