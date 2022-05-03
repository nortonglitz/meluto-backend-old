"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usernameProperty = exports.emailProperty = exports.lastNameProperty = exports.firstNameProperty = exports.passwordProperty = void 0;
exports.passwordProperty = {
    type: 'string',
    minLength: 8,
    pattern: '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]+$'
};
exports.firstNameProperty = {
    type: 'string',
    pattern: '^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$',
    minLength: 3,
    maxLength: 40
};
exports.lastNameProperty = {
    type: 'string',
    pattern: '^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$',
    minLength: 1,
    maxLength: 80
};
exports.emailProperty = {
    type: 'string',
    format: 'email',
    maxLength: 60
};
exports.usernameProperty = {
    type: 'string',
    pattern: '^[A-Za-z0-9áàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$',
    minLength: 3,
    maxLength: 40
};
