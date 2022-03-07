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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.editUser = void 0;
var models_1 = require("models");
var mongoose_1 = require("mongoose");
var cryptography_1 = require("utils/cryptography");
var formValidation_1 = require("utils/formValidation");
var date_fns_1 = require("date-fns");
var DAYS_TO_EDIT_NAME = 30;
var DAYS_TO_EDIT_USERNAME = 30;
var editUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, field, firstName, lastName, email, password, username, modifiedUser, userExists, userEmailExists, pastDays, _a, _b, _c, pastDays, userUsernameExists, err_1;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                userId = req.params.userId;
                field = req.params.field;
                firstName = req.body.firstName;
                lastName = req.body.lastName;
                email = req.body.email;
                password = req.body.password;
                username = req.body.username;
                _f.label = 1;
            case 1:
                _f.trys.push([1, 15, , 16]);
                modifiedUser = null;
                if (!userId || !(0, mongoose_1.isValidObjectId)(userId)) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'InvalidIdError',
                            message: 'can not use this id'
                        })];
                }
                return [4 /*yield*/, models_1.User.findById(userId)];
            case 2:
                userExists = _f.sent();
                if (!userExists) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'InvalidUserError',
                            message: 'user does not exists'
                        })];
                }
                if (!(field === 'email')) return [3 /*break*/, 5];
                (0, formValidation_1.validateEmail)(email);
                return [4 /*yield*/, models_1.User.findOne({ email: email })];
            case 3:
                userEmailExists = _f.sent();
                if (userEmailExists) {
                    return [2 /*return*/, res.status(409).json({
                            error: 'DuplicateEmailError',
                            message: 'email in use'
                        })];
                }
                return [4 /*yield*/, models_1.User.findByIdAndUpdate(userId, { email: email }, { "new": true })];
            case 4:
                modifiedUser = _f.sent();
                _f.label = 5;
            case 5:
                if (!(field === 'name')) return [3 /*break*/, 7];
                pastDays = (0, date_fns_1.differenceInDays)(new Date(), userExists.name.updatedAt);
                if (pastDays < DAYS_TO_EDIT_NAME) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'DateBlockError',
                            message: "must wait ".concat(DAYS_TO_EDIT_NAME - pastDays, " ").concat((DAYS_TO_EDIT_NAME - pastDays) < 2 ? 'day' : 'days', " to edit name")
                        })];
                }
                if (userExists.name.first === firstName && userExists.name.last === lastName) {
                    return [2 /*return*/, res.status(409).json({
                            error: 'SameNameError',
                            message: 'can not modify name'
                        })];
                }
                (0, formValidation_1.validateName)({ firstName: firstName, lastName: lastName });
                return [4 /*yield*/, models_1.User.findByIdAndUpdate(userId, { name: { first: firstName, last: lastName } }, { "new": true })];
            case 6:
                modifiedUser = _f.sent();
                _f.label = 7;
            case 7:
                if (!(field === 'password')) return [3 /*break*/, 11];
                return [4 /*yield*/, (0, cryptography_1.checkPassword)(password, userExists.password.value)];
            case 8:
                if (_f.sent()) {
                    return [2 /*return*/, res.status(409).json({
                            error: 'InvalidPasswordError',
                            message: 'can not modify password'
                        })];
                }
                (0, formValidation_1.validatePassword)(password);
                _b = (_a = models_1.User).findByIdAndUpdate;
                _c = [userId];
                _d = {};
                _e = {};
                return [4 /*yield*/, (0, cryptography_1.saltHashPassword)(password)];
            case 9: return [4 /*yield*/, _b.apply(_a, _c.concat([(_d.password = (_e.value = _f.sent(), _e), _d), { "new": true }]))];
            case 10:
                modifiedUser = _f.sent();
                _f.label = 11;
            case 11:
                if (!(field === 'username')) return [3 /*break*/, 14];
                pastDays = (0, date_fns_1.differenceInDays)(new Date(), userExists.username.updatedAt);
                if (pastDays < DAYS_TO_EDIT_USERNAME) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'DateBlockError',
                            message: "must wait ".concat(DAYS_TO_EDIT_USERNAME - pastDays, " ").concat((DAYS_TO_EDIT_USERNAME - pastDays) < 2 ? 'day' : 'days', " to edit username")
                        })];
                }
                if (username === userExists.username.value) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'SameUsernameError',
                            message: 'can not modify username'
                        })];
                }
                (0, formValidation_1.validateUsername)(username);
                return [4 /*yield*/, models_1.User.findOne({ username: { value: username } })];
            case 12:
                userUsernameExists = _f.sent();
                if (userUsernameExists) {
                    return [2 /*return*/, res.status(409).json({
                            error: 'DuplicateUsernameError',
                            message: 'username in use'
                        })];
                }
                return [4 /*yield*/, models_1.User.findByIdAndUpdate(userId, { username: { value: username } }, { "new": true })];
            case 13:
                modifiedUser = _f.sent();
                _f.label = 14;
            case 14:
                if (!modifiedUser) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'InvalidFieldError',
                            message: 'can not modify user'
                        })];
                }
                return [2 /*return*/, res.status(200).json(modifiedUser)];
            case 15:
                err_1 = _f.sent();
                if (err_1.name.includes('ValidationError')) {
                    return [2 /*return*/, res.status(400).json({
                            error: err_1.name,
                            path: err_1.stack,
                            message: err_1.message
                        })];
                }
                next(err_1);
                return [3 /*break*/, 16];
            case 16: return [2 /*return*/];
        }
    });
}); };
exports.editUser = editUser;
