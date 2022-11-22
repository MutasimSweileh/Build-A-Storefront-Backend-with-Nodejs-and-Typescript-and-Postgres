"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errors_1 = __importDefault(require("./middleware/errors"));
const authentication_1 = __importDefault(require("./middleware/authentication"));
const users_1 = __importStar(require("./routers/users"));
const orders_1 = __importDefault(require("./routers/orders"));
const products_1 = __importDefault(require("./routers/products"));
const dashboard_1 = __importDefault(require("./routers/dashboard"));
const helmet_1 = __importDefault(require("helmet"));
const debug_1 = __importDefault(require("debug"));
const d = (0, debug_1.default)('App');
//debug.enable('*');
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
//app.use(morgan('dev'));
const port = process.env.PORT || 3000;
app.listen(port, () => d(`App is listening on port ${port}.`));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.post('/login', users_1.authenticate);
app.use('/', products_1.default);
app.use('/', authentication_1.default, users_1.default);
app.use('/', authentication_1.default, orders_1.default);
app.use('/dashboard', authentication_1.default, dashboard_1.default);
app.use(errors_1.default);
exports.default = app;
