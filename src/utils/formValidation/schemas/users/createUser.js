"use strict";
exports.__esModule = true;
exports.validateCreateUser = void 0;
var formatError_1 = require("../../formatError");
var ajv_1 = require("ajv");
var ajv_formats_1 = require("ajv-formats");
var properties_1 = require("../../properties");
var ajv = new ajv_1["default"]();
(0, ajv_formats_1["default"])(ajv, ['email']);
var schema = {
    type: 'object',
    properties: {
        firstName: properties_1.firstNameProperty,
        lastName: properties_1.lastNameProperty,
        email: properties_1.emailProperty,
        password: properties_1.passwordProperty
    },
    additionalProperties: false,
    required: ['firstName', 'lastName', 'email', 'password']
};
var validate = ajv.compile(schema);
var validateCreateUser = function (data) {
    if (validate(data)) {
        return;
    }
    (0, formatError_1.formatError)(validate.errors);
};
exports.validateCreateUser = validateCreateUser;
