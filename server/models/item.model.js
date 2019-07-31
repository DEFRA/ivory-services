const Joi = require('@hapi/joi')
const BaseModel = require('./baseModel')
const { uuid } = require('../lib/utils')

module.exports = class Item extends BaseModel {
  static get params () {
    return {
      id: Joi.string().guid().example(uuid())
    }
  }

  static get schema () {
    return {
      description: Joi.string()
    }
  }
}
