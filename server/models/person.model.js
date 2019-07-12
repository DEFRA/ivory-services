const Joi = require('@hapi/joi')
const BaseModel = require('./baseModel')

module.exports = class Person extends BaseModel {
  static get params () {
    return {
      id: Joi.string().guid()
    }
  }

  static get schema () {
    return {
      fullName: Joi.string().example('Jon Doe'),
      email: Joi.string().email().example('jon.doe@test.defra.net'),
      addressId: Joi.string().guid().example('f73a9ea5-dc20-494a-abb7-89ef60c99715')
    }
  }
}
