const Joi = require('@hapi/joi')
const BaseModel = require('./baseModel')
const { uuid } = require('ivory-shared').utils

module.exports = class Group extends BaseModel {
  static get params () {
    return {
      id: Joi.string().guid().example(uuid())
    }
  }

  static get schema () {
    return {
      id: Joi.string().guid().allow(null).optional().example(uuid()),
      type: Joi.string().example('type'),
      title: Joi.string().example('pageHeading'),
      description: Joi.string().example('description'),
      hint: Joi.string().example('hint'),
      multiple: Joi.bool()
    }
  }
}
