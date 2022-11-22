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
exports.getAuth = void 0;
const Users_1 = require("../../models/Users");
function getAuth(request) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, Users_1.createRootUser)();
        const res = yield request
            .post('/login/')
            .send({ username: 'root', password: process.env.ROOT_USER_PASSWORD || 'password' });
        if (res.statusCode !== 200)
            console.log(res);
        return ['Authorization', `Bearer ${res.body.data.token}`];
    });
}
exports.getAuth = getAuth;
