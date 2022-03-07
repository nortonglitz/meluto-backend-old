"use strict";
exports.__esModule = true;
exports.validateCredentials = void 0;
var formatError_1 = require("../../formatError");
var ajv_1 = require("ajv");
var ajv = new ajv_1["default"]();
var schema = {
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
var validate = ajv.compile(schema);
var validateCredentials = function (data) {
    if (validate(data)) {
        return;
    }
    (0, formatError_1.formatError)(validate.errors);
};
exports.validateCredentials = validateCredentials;
