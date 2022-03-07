"use strict";
exports.__esModule = true;
exports.validatePassword = void 0;
var formatError_1 = require("../formatError");
var ajv_1 = require("ajv");
var properties_1 = require("../properties");
var ajv = new ajv_1["default"]();
var schema = {
    type: 'object',
    properties: {
        password: properties_1.passwordProperty
    },
    additionalProperties: false,
    required: ['password']
};
var validate = ajv.compile(schema);
var validatePassword = function (password) {
    if (validate({ password: password })) {
        return;
    }
    (0, formatError_1.formatError)(validate.errors);
};
exports.validatePassword = validatePassword;
