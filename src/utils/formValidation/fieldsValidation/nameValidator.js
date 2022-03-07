"use strict";
exports.__esModule = true;
exports.validateName = void 0;
var formatError_1 = require("../formatError");
var ajv_1 = require("ajv");
var properties_1 = require("../properties");
var ajv = new ajv_1["default"]();
var schema = {
    type: 'object',
    properties: {
        firstName: properties_1.firstNameProperty,
        lastName: properties_1.lastNameProperty
    },
    additionalProperties: false,
    required: ['firstName', 'lastName']
};
var validate = ajv.compile(schema);
var validateName = function (data) {
    if (validate(data)) {
        return;
    }
    (0, formatError_1.formatError)(validate.errors);
};
exports.validateName = validateName;
