"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorMiddleware = (error, _req, res, next) => {
    const status = error.status || 500;
    const message = error.message || 'Whoops!! something went wrong';
    if (!res)
        next();
    else
        res.status(status).json({ status, message });
};
exports.default = errorMiddleware;
