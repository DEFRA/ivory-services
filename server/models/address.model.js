const Joi = require('@hapi/joi')
const BaseModel = require('./baseModel')
const { uuid } = require('ivory-shared').utils

module.exports = class Address extends BaseModel {
  static get params () {
    return {
      id: Joi.string().guid().example(uuid())
    }
  }

  static get schema () {
    return {
      addressLine1: Joi.string(),
      addressLine2: Joi.string().optional(),
      town: Joi.string(),
      county: Joi.string().optional(),
      postcode: Joi.string().example('WA4 1AB'),
      country: Joi.string().optional(),
      uprn: Joi.string()
    }
  }
}
