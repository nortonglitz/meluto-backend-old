"use strict";
exports.__esModule = true;
var express_1 = require("express");
var auth_1 = require("middlewares/auth");
var sessions_1 = require("controllers/sessions");
var router = (0, express_1.Router)();
router.post('/:userId', auth_1.checkCredentials, sessions_1.createSession);
exports["default"] = router;
