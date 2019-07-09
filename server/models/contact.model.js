const Joi = require('@hapi/joi')
const BaseModel = require('./baseModel')

module.exports = class Contact extends BaseModel {
  static get params () {
    return {
      id: Joi.string().guid()
    }
  }

  static get schema () {
    return {
      firstName: Joi.string().example('Jon'),
      lastName: Joi.string().example('Doe'),
      applicationId: Joi.string().guid().example('76f06579-7cea-4061-9ba1-82d692d3f258'),
      customerId: Joi.string().guid().example('a3c6a1a4-e510-4578-a2c7-da4472bc0901'),
      type: Joi.string(),
      jobTitle: Joi.string(),
      email: Joi.string().email().example('jon.doe@test.defra.net'),
      dateOfBirth: Joi.date(),
      telephone: Joi.string(),
      addressId: Joi.string().guid().example('f73a9ea5-dc20-494a-abb7-89ef60c99715'),
      organisationType: Joi.string(),
      fullAddress: Joi.string()
    }
  }
}
