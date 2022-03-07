"use strict";
exports.__esModule = true;
exports.randomString = void 0;
var randomString = function (length) {
    var generatedString = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        generatedString += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return generatedString;
};
exports.randomString = randomString;
