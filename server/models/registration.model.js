const Joi = require('@hapi/joi')
const BaseModel = require('./baseModel')

module.exports = class Registration extends BaseModel {
  static get params () {
    return {
      id: Joi.string().guid()
    }
  }

  static get schema () {
    return {
      itemId: Joi.string().guid(),
      ownerId: Joi.string().guid(),
      agentId: Joi.string().guid(),
      agentActingAs: Joi.string()
    }
  }
}
