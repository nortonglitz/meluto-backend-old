"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomString = void 0;
const randomString = (length) => {
    let generatedString = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        generatedString += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return generatedString;
};
exports.randomString = randomString;
