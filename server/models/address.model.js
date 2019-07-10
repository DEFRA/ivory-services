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
      addressLine: Joi.string()
    }
  }
}
