"use strict";
exports.__esModule = true;
exports.validateUsername = void 0;
var formatError_1 = require("../formatError");
var ajv_1 = require("ajv");
var properties_1 = require("../properties");
var ajv = new ajv_1["default"]();
var schema = {
    type: 'object',
    properties: {
        username: properties_1.usernameProperty
    },
    additionalProperties: false,
    required: ['username']
};
var validate = ajv.compile(schema);
var validateUsername = function (username) {
    if (validate({ username: username })) {
        return;
    }
    (0, formatError_1.formatError)(validate.errors);
};
exports.validateUsername = validateUsername;
