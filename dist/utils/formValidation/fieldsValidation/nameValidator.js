"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateName = void 0;
const formatError_1 = require("../formatError");
const ajv_1 = __importDefault(require("ajv"));
const properties_1 = require("../properties");
const ajv = new ajv_1.default();
const schema = {
    type: 'object',
    properties: {
        firstName: properties_1.firstNameProperty,
        lastName: properties_1.lastNameProperty
    },
    additionalProperties: false,
    required: ['firstName', 'lastName']
};
const validate = ajv.compile(schema);
const validateName = (data) => {
    if (validate(data)) {
        return;
    }
    (0, formatError_1.formatError)(validate.errors);
};
exports.validateName = validateName;
