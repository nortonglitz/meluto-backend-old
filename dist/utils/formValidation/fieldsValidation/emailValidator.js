"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = void 0;
const formatError_1 = require("../formatError");
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const properties_1 = require("../properties");
const ajv = new ajv_1.default();
(0, ajv_formats_1.default)(ajv, ['email']);
const schema = {
    type: 'object',
    properties: {
        email: properties_1.emailProperty
    },
    additionalProperties: false,
    required: ['email']
};
const validate = ajv.compile(schema);
const validateEmail = (email) => {
    if (validate({ email })) {
        return;
    }
    (0, formatError_1.formatError)(validate.errors);
};
exports.validateEmail = validateEmail;
