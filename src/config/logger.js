"use strict";
exports.__esModule = true;
var winston_1 = require("winston");
var combine = winston_1.format.combine, timestamp = winston_1.format.timestamp, printf = winston_1.format.printf, colorize = winston_1.format.colorize, json = winston_1.format.json;
var myFormat = printf(function (_a) {
    var level = _a.level, message = _a.message, label = _a.label, timestamp = _a.timestamp, stack = _a.stack;
    return "[".concat(timestamp, "] (").concat(label, ") ").concat(level, ": ").concat(message, " ").concat(stack);
});
var logger = winston_1["default"].createLogger({
    level: 'info',
    format: combine(json(), timestamp({ format: 'dd/MMM HH:mm:ss.SSS' }), myFormat),
    transports: new winston_1["default"].transports.File({ dirname: 'logs', filename: 'list.log' })
});
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1["default"].transports.Console({
        format: combine(timestamp({ format: 'HH:mm:ss.SSS' }), colorize({ all: true }))
    }));
}
exports["default"] = logger;
