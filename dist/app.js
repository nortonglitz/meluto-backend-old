"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("config/database");
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("routes"));
const error_1 = require("middlewares/error");
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
try {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((0, helmet_1.default)());
    app.use((0, cookie_parser_1.default)());
    app.use(routes_1.default);
    app.use(error_1.logErrors);
    app.listen(PORT);
    console.log(`🌎 Server running on port ${PORT}...`);
}
catch (err) {
    console.log('💀 Server failed to start', err);
}
