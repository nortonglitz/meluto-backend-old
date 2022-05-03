"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importStar(require("winston"));
const { combine, timestamp, printf, colorize, json } = winston_1.format;
const myFormat = printf(({ level, message, label, timestamp, stack }) => {
    return `[${timestamp}] (${label}) ${level}: ${message} ${stack}`;
});
const logger = winston_1.default.createLogger({
    level: 'info',
    format: combine(json(), timestamp({ format: 'dd/MMM HH:mm:ss.SSS' }), myFormat),
    transports: new winston_1.default.transports.File({ dirname: 'logs', filename: 'list.log' })
});
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.default.transports.Console({
        format: combine(timestamp({ format: 'HH:mm:ss.SSS' }), colorize({ all: true }))
    }));
}
exports.default = logger;
