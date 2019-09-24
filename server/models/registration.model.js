const Joi = require('@hapi/joi')
const BaseModel = require('./baseModel')
const { uuid } = require('ivory-shared').utils

module.exports = class Registration extends BaseModel {
  static get params () {
    return {
      id: Joi.string().guid().example(uuid())
    }
  }

  static get schema () {
    return {
      id: Joi.string().guid().allow(null).optional().example(uuid()),
      itemId: Joi.string().guid().example(uuid()),
      ownerId: Joi.string().guid().example(uuid()),
      agentId: Joi.string().guid().example(uuid()),
      paymentId: Joi.string().guid().example(uuid()),
      registrationNumber: Joi.string(),
      agentActingAs: Joi.string(),
      agentIsOwner: Joi.bool().example(true),
      dealingIntent: Joi.string(),
      status: Joi.string()
    }
  }
}
