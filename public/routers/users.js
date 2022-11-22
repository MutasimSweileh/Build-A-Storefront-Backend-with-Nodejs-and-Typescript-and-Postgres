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
exports.authenticate = void 0;
const express_1 = require("express");
const Users_1 = require("../models/Users");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const user = new Users_1.Users();
const router = (0, express_1.Router)();
const index = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user.index();
        res.json({
            status: 'success',
            data: users
        });
    }
    catch (err) {
        next(err);
    }
});
const show = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const User = yield user.show(req.params.id);
        res.json({
            status: 'success',
            data: User
        });
    }
    catch (err) {
        next(err);
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const User = {
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: req.body.password
        };
        const newUser = yield user.create(User);
        res.json({
            status: 'success',
            data: newUser
        });
    }
    catch (err) {
        next(err);
    }
});
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const User = {
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname
        };
        const newUser = yield user.update(id, User);
        res.json({
            status: 'success',
            data: newUser
        });
    }
    catch (err) {
        next(err);
    }
});
const destroy = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield user.delete(req.params.id);
        res.json({
            status: 'success',
            data: deleted
        });
    }
    catch (err) {
        next(err);
    }
});
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const u = yield user.authenticate(username, password);
        const token = jsonwebtoken_1.default.sign({ u }, config_1.default.tokenSecret);
        if (!u) {
            return res.status(401).json({
                status: 'error',
                message: 'the username and password do not match please try again'
            });
        }
        return res.json({
            status: 'success',
            data: Object.assign(Object.assign({}, u), { token }),
            message: 'User authenticated successfully'
        });
    }
    catch (err) {
        return next(err);
    }
});
exports.authenticate = authenticate;
router.get('/users', index);
router.get('/users/:id', show);
router.post('/users', create);
router.put('/users/:id', update);
router.delete('/users/:id', destroy);
exports.default = router;
