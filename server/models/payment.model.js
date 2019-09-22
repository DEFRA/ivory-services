const Joi = require('@hapi/joi')
const BaseModel = require('./baseModel')
const { uuid } = require('ivory-shared').utils

module.exports = class Payment extends BaseModel {
  static get params () {
    return {
      id: Joi.string().guid().example(uuid())
    }
  }

  static get schema () {
    return {
      id: Joi.string().guid().allow(null).optional().example(uuid()),
      paymentId: Joi.string(),
      paymentProvider: Joi.string(),
      description: Joi.string(),
      reference: Joi.string(),
      status: Joi.string(),
      amount: Joi.number(),
      createdDate: Joi.string()
    }
  }
}
