"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatError = void 0;
const formatError = (errors) => {
    if (errors) {
        const e = new Error(`(${errors[0].keyword}) ${errors[0].message}`);
        e.name = 'ValidationError';
        e.stack = errors[0].instancePath;
        throw e;
    }
};
exports.formatError = formatError;
