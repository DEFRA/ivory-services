const Joi = require('@hapi/joi')
const BaseModel = require('./baseModel')
const uuid = require('uuid/v1')

module.exports = class Registration extends BaseModel {
  static get params () {
    return {
      id: Joi.string().guid()
    }
  }

  static get schema () {
    return {
      itemId: Joi.string().guid().example(uuid()),
      ownerId: Joi.string().guid().example(uuid()),
      agentId: Joi.string().guid().example(uuid()),
      agentActingAs: Joi.string()
    }
  }
}
