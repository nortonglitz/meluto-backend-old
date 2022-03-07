"use strict";
exports.__esModule = true;
exports.validateEmail = void 0;
var formatError_1 = require("../formatError");
var ajv_1 = require("ajv");
var ajv_formats_1 = require("ajv-formats");
var properties_1 = require("../properties");
var ajv = new ajv_1["default"]();
(0, ajv_formats_1["default"])(ajv, ['email']);
var schema = {
    type: 'object',
    properties: {
        email: properties_1.emailProperty
    },
    additionalProperties: false,
    required: ['email']
};
var validate = ajv.compile(schema);
var validateEmail = function (email) {
    if (validate({ email: email })) {
        return;
    }
    (0, formatError_1.formatError)(validate.errors);
};
exports.validateEmail = validateEmail;
