const Joi = require('@hapi/joi')
const BaseModel = require('./baseModel')
const { uuid } = require('../lib/utils')

module.exports = class Person extends BaseModel {
  static get params () {
    return {
      id: Joi.string().guid().example(uuid())
    }
  }

  static get schema () {
    return {
      fullName: Joi.string().example('Jon Doe'),
      email: Joi.string().email().example('jon.doe@test.defra.net'),
      addressId: Joi.string().guid().example(uuid())
    }
  }
}
