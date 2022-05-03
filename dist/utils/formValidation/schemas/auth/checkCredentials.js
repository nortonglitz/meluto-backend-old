"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCredentials = void 0;
const formatError_1 = require("../../formatError");
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const schema = {
    type: 'object',
    properties: {
        password: { type: 'string' },
        email: { type: 'string' },
        username: { type: 'string' }
    },
    anyOf: [{ required: ['email'] }, { required: ['username'] }],
    required: ['password'],
    additionalProperties: false
};
const validate = ajv.compile(schema);
const validateCredentials = (data) => {
    if (validate(data)) {
        return;
    }
    (0, formatError_1.formatError)(validate.errors);
};
exports.validateCredentials = validateCredentials;
