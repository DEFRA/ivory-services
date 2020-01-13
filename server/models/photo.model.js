const Joi = require('@hapi/joi')
const BaseModel = require('./baseModel')
const { uuid } = require('defra-hapi-utils').utils

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
      originalFilename: Joi.string().example('example.jpg'),
      confirmed: Joi.bool(),
      rank: Joi.number().example(10)
    }
  }

  static validForPayment (photo) {
    if (!photo) {
      return false
    }

    const { filename, confirmed } = photo

    return !(!filename || !confirmed)
  }
}
