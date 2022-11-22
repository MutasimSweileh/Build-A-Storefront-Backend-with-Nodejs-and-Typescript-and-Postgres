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
const Users_1 = require("../../models/Users");
const user = new Users_1.Users();
describe('User Model', () => {
    it('should have an index method', () => {
        expect(user.index).toBeDefined();
    });
    it('should have a show method', () => {
        expect(user.show).toBeDefined();
    });
    it('should have a create method', () => {
        expect(user.create).toBeDefined();
    });
    it('should have a update method', () => {
        expect(user.update).toBeDefined();
    });
    it('should have a delete method', () => {
        expect(user.delete).toBeDefined();
    });
    let id;
    it('create method should add a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield user.create({
            username: 'MutasimSweileh',
            password: 'test1234',
            firstname: 'Mutasim',
            lastname: 'Sweileh'
        });
        expect(result.username).toEqual('MutasimSweileh');
        id = result.id;
    }));
    it('index method should return a list of users', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield user.index();
        expect(result).toContain({
            id,
            username: 'MutasimSweileh',
            firstname: 'Mutasim',
            lastname: 'Sweileh'
        });
    }));
    it('show method should return the correct user', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield user.show(`${id}`);
        expect(result.username).toEqual('MutasimSweileh');
    }));
    it('update method should edit a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield user.update(id, {
            username: 'MutasimSweileh2',
            password: 'test12345',
            firstname: 'Mutasim',
            lastname: 'Sweileh'
        });
        expect(result).toEqual({
            id,
            username: 'MutasimSweileh2',
            firstname: 'Mutasim',
            lastname: 'Sweileh'
        });
    }));
    it('delete method should remove the user', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield user.delete(`${id}`);
        expect(result.id).toEqual(id);
    }));
});
