"use strict";
exports.__esModule = true;
exports.logErrors = void 0;
var logger_1 = require("config/logger");
var logErrors = function (err, req, res, next) {
    if (err.name.includes('SyntaxError')) {
        return res.status(400).json({
            error: 'SyntaxError',
            message: 'code can not be parsed'
        });
    }
    logger_1["default"].error({
        message: err.message,
        label: err.name,
        stack: err.stack
    });
    return res.status(500).json({
        error: 'InternalServerError',
        message: 'something went wrong'
    });
};
exports.logErrors = logErrors;
