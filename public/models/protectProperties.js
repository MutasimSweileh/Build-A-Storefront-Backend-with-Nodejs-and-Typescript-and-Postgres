"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
class cleanProperties {
    constructor() {
        this.hide_properties = ['password', 'active'];
    }
    cleanProperties(U) {
        if (U === null || U === undefined)
            return U;
        const isArray = Array.isArray(U);
        if (!isArray)
            U = [U];
        const result = U.map((v) => {
            const property = {};
            Object.keys(v).forEach(c => {
                if (!this.hide_properties.includes(c))
                    property[c] = v[c];
            });
            return property;
        });
        if (!isArray)
            return result[0];
        return result;
    }
}
exports.default = cleanProperties;
