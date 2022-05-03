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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const random_1 = require("utils/random");
const models_1 = require("models");
const cryptography_1 = require("utils/cryptography");
const formValidation_1 = require("utils/formValidation");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    try {
        const userExists = yield models_1.User.findOne({ email });
        if (userExists) {
            return res.status(409).json({
                error: 'DuplicateEmail',
                message: 'Email already in use.'
            });
        }
        (0, formValidation_1.validateCreateUser)({
            firstName: firstName,
            lastName: lastName,
            email,
            password
        });
        const newUser = yield models_1.User.create({
            username: {
                value: (0, random_1.randomString)(12)
            },
            name: {
                first: firstName,
                last: lastName
            },
            email,
            password: {
                value: yield (0, cryptography_1.saltHashPassword)(password)
            }
        });
        const _a = newUser.toObject(), { password: _deletePassword, __v } = _a, userInfo = __rest(_a, ["password", "__v"]);
        return res.status(200).json({
            message: 'User created',
            user: Object.assign({}, userInfo)
        });
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
exports.createUser = createUser;
