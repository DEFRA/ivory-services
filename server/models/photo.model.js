const Joi = require('@hapi/joi')
const BaseModel = require('./baseModel')
const { uuid } = require('ivory-shared').utils

module.exports = class Photo extends BaseModel {
  static get params () {
    return {
      id: Joi.string().guid().example(uuid())
    }
  }

  static get schema () {
    return {
      id: Joi.string().guid().allow(null).optional().example(uuid()),
      itemId: Joi.string().guid().example(uuid()),
      filename: Joi.string().example('1234567890.jpg'),
      rank: Joi.number().example(10)
    }
  }
}
