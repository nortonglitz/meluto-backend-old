"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var nameSchema = new mongoose_1.Schema({
    first: { type: String, required: [true, 'First name is required.'] },
    last: { type: String, required: [true, 'Last name is required.'] }
}, { timestamps: { createdAt: false }, _id: false });
var passwordSchema = new mongoose_1.Schema({
    value: { type: String, required: [true, 'Password is required.'] }
}, { timestamps: { createdAt: false }, _id: false });
var usernameSchema = new mongoose_1.Schema({
    value: { type: String, unique: true, required: true }
}, { timestamps: { createdAt: false }, _id: false });
var userSchema = new mongoose_1.Schema({
    username: { type: usernameSchema },
    password: { type: passwordSchema },
    name: { type: nameSchema },
    email: { type: String, required: [true, 'E-mail is required.'], unique: true },
    emailVerified: { type: Boolean, "default": false },
    role: {
        type: String,
        "default": 'user',
        "enum": {
            values: ['user', 'admin', 'real estate', 'construction company', 'developer company', 'agent'],
            message: '{VALUE} is not a valid role.'
        }
    },
    createdAt: { type: Date, immutable: true }
}, { timestamps: true });
exports["default"] = (0, mongoose_1.model)('User', userSchema);
