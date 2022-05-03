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
exports.verifyJwt = exports.issueJwt = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const jwt_1 = require("config/jwt");
const path_1 = require("path");
const fs_1 = require("fs");
const util_1 = require("util");
const privKeyPath = (0, path_1.resolve)(__dirname, '..', '..', 'priv_key.pem');
const pubKeyPath = (0, path_1.resolve)(__dirname, '..', '..', 'pub_key.pem');
const read = (0, util_1.promisify)(fs_1.readFile);
const asyncVerify = (token, secretOrPublicKey, options) => {
    return new Promise((resolve, reject) => {
        (0, jsonwebtoken_1.verify)(token, secretOrPublicKey, options, (err, decoded) => {
            if (err)
                reject(err);
            if (!decoded) {
                const e = new Error('invalid secret issued');
                e.name = 'VerifyTokenError';
                reject(e);
            }
            else {
                resolve(decoded);
            }
        });
    });
};
const asyncSign = (payload, secretOrPrivateKey, options) => {
    return new Promise((resolve, reject) => {
        (0, jsonwebtoken_1.sign)(payload, secretOrPrivateKey, options, (err, encoded) => {
            if (err)
                reject(err);
            if (!encoded) {
                const e = new Error('could not generate token');
                e.name = 'GenerateTokenError';
                reject(e);
            }
            else {
                resolve(encoded);
            }
        });
    });
};
const issueJwt = (id, type) => __awaiter(void 0, void 0, void 0, function* () {
    const privKey = yield read(privKeyPath, 'utf8');
    const payload = {
        sub: id
    };
    const token = yield asyncSign(payload, privKey, {
        expiresIn: type === 'accessToken' ? jwt_1.accessToken.expiresIn : jwt_1.refreshToken.expiresIn,
        algorithm: type === 'accessToken' ? jwt_1.accessToken.algorithm : jwt_1.refreshToken.algorithm
    });
    return token;
});
exports.issueJwt = issueJwt;
const verifyJwt = (token, type) => __awaiter(void 0, void 0, void 0, function* () {
    const pubKey = yield read(pubKeyPath, 'utf8');
    const payload = yield asyncVerify(token, pubKey, {
        algorithms: type === 'accessToken' ? jwt_1.accessToken.algorithms : jwt_1.refreshToken.algorithms
    });
    return payload;
});
exports.verifyJwt = verifyJwt;
