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
exports.editUser = void 0;
const models_1 = require("models");
const mongoose_1 = require("mongoose");
const cryptography_1 = require("utils/cryptography");
const formValidation_1 = require("utils/formValidation");
const date_fns_1 = require("date-fns");
const DAYS_TO_EDIT_NAME = 30;
const DAYS_TO_EDIT_USERNAME = 30;
const editUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const field = req.params.field;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    try {
        let modifiedUser = null;
        if (!userId || !(0, mongoose_1.isValidObjectId)(userId)) {
            return res.status(400).json({
                error: 'InvalidIdError',
                message: 'can not use this id'
            });
        }
        const userExists = yield models_1.User.findById(userId);
        if (!userExists) {
            return res.status(400).json({
                error: 'InvalidUserError',
                message: 'user does not exists'
            });
        }
        if (field === 'email') {
            (0, formValidation_1.validateEmail)(email);
            const userEmailExists = yield models_1.User.findOne({ email });
            if (userEmailExists) {
                return res.status(409).json({
                    error: 'DuplicateEmailError',
                    message: 'email in use'
                });
            }
            modifiedUser = yield models_1.User.findByIdAndUpdate(userId, { email }, { new: true });
        }
        if (field === 'name') {
            const pastDays = (0, date_fns_1.differenceInDays)(new Date(), userExists.name.updatedAt);
            if (pastDays < DAYS_TO_EDIT_NAME) {
                return res.status(400).json({
                    error: 'DateBlockError',
                    message: `must wait ${DAYS_TO_EDIT_NAME - pastDays} ${(DAYS_TO_EDIT_NAME - pastDays) < 2 ? 'day' : 'days'} to edit name`
                });
            }
            if (userExists.name.first === firstName && userExists.name.last === lastName) {
                return res.status(409).json({
                    error: 'SameNameError',
                    message: 'can not modify name'
                });
            }
            (0, formValidation_1.validateName)({ firstName, lastName });
            modifiedUser = yield models_1.User.findByIdAndUpdate(userId, { name: { first: firstName, last: lastName } }, { new: true });
        }
        if (field === 'password') {
            if (yield (0, cryptography_1.checkPassword)(password, userExists.password.value)) {
                return res.status(409).json({
                    error: 'InvalidPasswordError',
                    message: 'can not modify password'
                });
            }
            (0, formValidation_1.validatePassword)(password);
            modifiedUser = yield models_1.User.findByIdAndUpdate(userId, { password: { value: yield (0, cryptography_1.saltHashPassword)(password) } }, { new: true });
        }
        if (field === 'username') {
            const pastDays = (0, date_fns_1.differenceInDays)(new Date(), userExists.username.updatedAt);
            if (pastDays < DAYS_TO_EDIT_USERNAME) {
                return res.status(400).json({
                    error: 'DateBlockError',
                    message: `must wait ${DAYS_TO_EDIT_USERNAME - pastDays} ${(DAYS_TO_EDIT_USERNAME - pastDays) < 2 ? 'day' : 'days'} to edit username`
                });
            }
            if (username === userExists.username.value) {
                return res.status(400).json({
                    error: 'SameUsernameError',
                    message: 'can not modify username'
                });
            }
            (0, formValidation_1.validateUsername)(username);
            const userUsernameExists = yield models_1.User.findOne({ username: { value: username } });
            if (userUsernameExists) {
                return res.status(409).json({
                    error: 'DuplicateUsernameError',
                    message: 'username in use'
                });
            }
            modifiedUser = yield models_1.User.findByIdAndUpdate(userId, { username: { value: username } }, { new: true });
        }
        if (!modifiedUser) {
            return res.status(400).json({
                error: 'InvalidFieldError',
                message: 'can not modify user'
            });
        }
        return res.status(200).json(modifiedUser);
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
exports.editUser = editUser;
