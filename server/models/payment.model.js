const Joi = require('joi')
const BaseModel = require('./baseModel')
const { uuid } = require('../utils/utils')

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
      code: Joi.string(),
      message: Joi.string(),
      amount: Joi.number(),
      createdDate: Joi.string()
    }
  }
}
