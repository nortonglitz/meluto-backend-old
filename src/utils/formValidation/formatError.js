"use strict";
exports.__esModule = true;
exports.formatError = void 0;
var formatError = function (errors) {
    if (errors) {
        var e = new Error("(".concat(errors[0].keyword, ") ").concat(errors[0].message));
        e.name = 'ValidationError';
        e.stack = errors[0].instancePath;
        throw e;
    }
};
exports.formatError = formatError;
