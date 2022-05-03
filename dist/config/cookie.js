"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionCookie = void 0;
exports.sessionCookie = {
    accessTokenName: 'at',
    refreshTokenName: 'rt',
    maxAge: 7776000000,
    httpOnly: true,
    sameSite: 'strict'
};
