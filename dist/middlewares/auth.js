"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCredentials = void 0;
const models_1 = require("models");
const checkCredentials_1 = require("utils/formValidation/schemas/auth/checkCredentials");
const checkCredentials = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const password = req.body.password;
    const username = req.body.username;
    const email = req.body.email;
    let userExists = null;
    try {
        (0, checkCredentials_1.validateCredentials)({ password, username, email });
        if ((email && username) || (email && !username)) {
            userExists = yield models_1.User.findOne({ email });
        }
        else {
            userExists = yield models_1.User.findOne({ 'username.value': username });
        }
        if (!userExists) {
            return res.status(400).json({
                error: 'InvalidUserError',
                message: 'user is not available'
            });
        }
        return next();
    }
    catch (err) {
        if (err.name.includes('ValidationError')) {
            return res.status(400).json({
                error: err.name,
                path: err.stack,
                message: err.message
            });
        }
        next(err);
    }
});
exports.checkCredentials = checkCredentials;
