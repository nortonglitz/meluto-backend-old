import { JSONSchemaType } from 'ajv'

export const passwordProperty: JSONSchemaType<string> = {
  type: 'string',
  minLength: 8,
  pattern: '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]+$'
}

export const firstNameProperty: JSONSchemaType<string> = {
  type: 'string',
  pattern: '^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$',
  minLength: 3,
  maxLength: 40
}

export const lastNameProperty: JSONSchemaType<string> = {
  type: 'string',
  pattern: '^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$',
  minLength: 1,
  maxLength: 80
}

export const emailProperty: JSONSchemaType<string> = {
  type: 'string',
  format: 'email',
  maxLength: 60
}

export const usernameProperty: JSONSchemaType<string> = {
  type: 'string',
  pattern: '^[A-Za-z0-9áàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$',
  minLength: 3,
  maxLength: 40
}