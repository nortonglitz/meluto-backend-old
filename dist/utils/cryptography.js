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
exports.checkPassword = exports.saltHashPassword = void 0;
const crypto_1 = require("crypto");
const util_1 = require("util");
if (!process.env.CRYPTO_PEPPER) {
    throw new Error('Cryptography is impaired, pepper is missing. Please edit .env file.');
}
if (!process.env.CRYPTO_ALGORITHM) {
    throw new Error('Cryptography is impaired, algorithm is missing. Please edit .env file.');
}
if (!process.env.CRYPTO_ITERATIONS) {
    throw new Error('Cryptography is impaired, iterations is missing. Please edit .env file.');
}
if (!process.env.CRYPTO_KEYLEN) {
    throw new Error('Cryptography is impaired, keylen is missing. Please edit .env file.');
}
const PEPPER = process.env.CRYPTO_PEPPER;
const ALGORITHM = process.env.CRYPTO_ALGORITHM;
const ITERATIONS = Number(process.env.CRYPTO_ITERATIONS);
const KEYLEN = Number(process.env.CRYPTO_KEYLEN);
const generateBytes = (0, util_1.promisify)(crypto_1.randomBytes);
const generateHash = (0, util_1.promisify)(crypto_1.pbkdf2);
const saltHashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = (yield generateBytes(32)).toString('base64url');
    const hash = (yield generateHash(password + PEPPER, salt, ITERATIONS, KEYLEN, ALGORITHM)).toString('base64url');
    return `${salt}:${hash}`;
});
exports.saltHashPassword = saltHashPassword;
const checkPassword = (password, saltHash) => __awaiter(void 0, void 0, void 0, function* () {
    const [salt, hash] = saltHash.split(':');
    const checkHash = (yield generateHash(password + PEPPER, salt, ITERATIONS, KEYLEN, ALGORITHM));
    return (0, crypto_1.timingSafeEqual)(checkHash, Buffer.from(hash, 'base64url'));
});
exports.checkPassword = checkPassword;
