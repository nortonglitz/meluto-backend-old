"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("middlewares/auth");
const sessions_1 = require("controllers/sessions");
const router = (0, express_1.Router)();
router.post('/:userId', auth_1.checkCredentials, sessions_1.createSession);
exports.default = router;
