const Joi = require('@hapi/joi')
const BaseModel = require('./baseModel')

module.exports = class Address extends BaseModel {
  static get params () {
    return {
      id: Joi.string().guid()
    }
  }

  static get schema () {
    return {
      postcode: Joi.string(),
      buildingNumber: Joi.string(),
      street: Joi.string(),
      town: Joi.string(),
      county: Joi.string(),
      country: Joi.string(),
      uprn: Joi.string()
    }
  }
}
