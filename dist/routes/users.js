"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("controllers/users");
const router = (0, express_1.Router)();
router.post('/', users_1.createUser);
router.put('/:userId/:field', users_1.editUser);
exports.default = router;
