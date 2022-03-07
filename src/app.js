"use strict";
exports.__esModule = true;
require("dotenv/config");
require("config/database");
var express_1 = require("express");
var helmet_1 = require("helmet");
var cookie_parser_1 = require("cookie-parser");
var routes_1 = require("routes");
var error_1 = require("middlewares/error");
var PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
try {
    var app = (0, express_1["default"])();
    app.use(express_1["default"].json());
    app.use((0, helmet_1["default"])());
    app.use((0, cookie_parser_1["default"])());
    app.use(routes_1["default"]);
    app.use(error_1.logErrors);
    app.listen(PORT);
    console.log("\uD83C\uDF0E Server running on port ".concat(PORT, "..."));
}
catch (err) {
    console.log('💀 Server failed to start', err);
}
