const Joi = require('@hapi/joi')
const BaseModel = require('./baseModel')
const { uuid } = require('ivory').utils

module.exports = class Address extends BaseModel {
  static get params () {
    return {
      id: Joi.string().guid().example(uuid())
    }
  }

  static get schema () {
    return {
      postcode: Joi.string().example('WA4 1AB'),
      buildingNumber: Joi.string(),
      street: Joi.string().optional(),
      town: Joi.string(),
      county: Joi.string().optional(),
      country: Joi.string().optional(),
      uprn: Joi.string()
    }
  }
}
