const Joi = require('@hapi/joi')
const BaseModel = require('./baseModel')
const uuid = require('uuid/v1')

module.exports = class Choice extends BaseModel {
  static get params () {
    return {
      id: Joi.string().guid()
    }
  }

  static get schema () {
    return {
      groupId: Joi.string().guid().example(uuid()),
      rank: Joi.number().example(10),
      label: Joi.string().example('label'),
      heading: Joi.string().example('heading'),
      shortName: Joi.string().example('short-name'),
      hint: Joi.string().example('hint')
    }
  }
}