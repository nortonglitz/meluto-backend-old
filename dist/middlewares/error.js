"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logErrors = void 0;
const logger_1 = __importDefault(require("config/logger"));
const logErrors = (err, req, res, next) => {
    if (err.name.includes('SyntaxError')) {
        return res.status(400).json({
            error: 'SyntaxError',
            message: 'code can not be parsed'
        });
    }
    logger_1.default.error({
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
