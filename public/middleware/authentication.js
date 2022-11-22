"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const handleError = (next) => {
    const error = new Error('Login Error, Please login again');
    error.status = 401;
    next(error);
};
const verifyAuthToken = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader)
            return handleError(next);
        const token = authorizationHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.tokenSecret);
        if (decoded) {
            next();
        }
        else {
            handleError(next);
        }
    }
    catch (error) {
        handleError(next);
    }
};
exports.default = verifyAuthToken;
