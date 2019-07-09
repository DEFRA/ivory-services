const Joi = require('@hapi/joi')
const BaseModel = require('./baseModel')

module.exports = class Application extends BaseModel {
  static get params () {
    return {
      id: Joi.string().guid()
    }
  }

  static get schema () {
    return {
      categoryId: Joi.string().guid(),
      contactId: Joi.string().guid()
    }
  }
}
