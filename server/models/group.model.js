const Joi = require('@hapi/joi')
const BaseModel = require('./baseModel')

module.exports = class Group extends BaseModel {
  static get params () {
    return {
      id: Joi.string().guid()
    }
  }

  static get schema () {
    return {
      type: Joi.string().example('type'),
      title: Joi.string().example('title'),
      description: Joi.string().example('description'),
      hint: Joi.string().example('hint'),
      multiple: Joi.bool().default(false)
    }
  }
}
