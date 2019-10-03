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
      id: Joi.string().guid().allow(null).optional().example(uuid()),
      businessName: Joi.string().allow(null, '').optional(),
      addressLine1: Joi.string(),
      addressLine2: Joi.string().allow(null, '').optional(),
      town: Joi.string(),
      county: Joi.string().allow(null, '').optional(),
      postcode: Joi.string().example('WA4 1AB'),
      country: Joi.string().allow(null, '').optional(),
      uprn: Joi.string()
    }
  }
}
