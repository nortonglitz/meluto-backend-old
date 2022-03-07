"use strict";
exports.__esModule = true;
var express_1 = require("express");
var users_1 = require("controllers/users");
var router = (0, express_1.Router)();
router.post('/', users_1.createUser);
router.put('/:userId/:field', users_1.editUser);
exports["default"] = router;
