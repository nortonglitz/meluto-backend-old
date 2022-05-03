"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = void 0;
const formatError_1 = require("../formatError");
const ajv_1 = __importDefault(require("ajv"));
const properties_1 = require("../properties");
const ajv = new ajv_1.default();
const schema = {
    type: 'object',
    properties: {
        password: properties_1.passwordProperty
    },
    additionalProperties: false,
    required: ['password']
};
const validate = ajv.compile(schema);
const validatePassword = (password) => {
    if (validate({ password })) {
        return;
    }
    (0, formatError_1.formatError)(validate.errors);
};
exports.validatePassword = validatePassword;
