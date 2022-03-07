"use strict";
exports.__esModule = true;
var express_1 = require("express");
var users_1 = require("./users");
var sessions_1 = require("./sessions");
var router = (0, express_1.Router)();
router.use('/users', users_1["default"]);
router.use('/sessions', sessions_1["default"]);
exports["default"] = router;
