const Joi = require('@hapi/joi')
const BaseModel = require('./baseModel')
const { uuid } = require('ivory-shared').utils

module.exports = class Choice extends BaseModel {
  static get params () {
    return {
      id: Joi.string().guid().example(uuid())
    }
  }

  static get schema () {
    return {
      id: Joi.string().guid().allow(null).optional().example(uuid()),
      groupId: Joi.string().guid().example(uuid()),
      rank: Joi.number().example(10),
      label: Joi.string().example('label'),
      heading: Joi.string().example('heading'),
      shortName: Joi.string().example('short-name'),
      hint: Joi.string().example('hint'),
      value: Joi.optional()
    }
  }
}
