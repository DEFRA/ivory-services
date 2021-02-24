const Joi = require('joi')
const Dal = require('../dal')
const { logger } = require('defra-logging-facade')

module.exports = class BaseModel {
  static get schema () {
    throw new Error(`The schema getter needs to be implemented within the ${this.name} class`)
  }

  constructor (data) {
    const { value, error } = this.constructor.validate(data, { abortEarly: false })
    if (error) {
      throw new Error(`The constructor data is invalid. ${error.message}`)
    } else {
      Object.assign(this, value)
    }
  }

  static validate (...args) {
    const { schema } = this
    if (Joi.isSchema(schema)) {
      return schema.validate(...args)
    }
    return Joi.object(schema).validate(...args)
  }

  static validateParams (...args) {
    const { params } = this
    if (Joi.isSchema(params)) {
      return params.validate(...args)
    }
    return Joi.object(params).validate(...args)
  }

  static async getAll (query) {
    return await Dal[this.name].findAll(query) || []
  }

  static async getById (id) {
    return Dal[this.name].find(id)
  }

  async save () {
    logger.debug('Saving: ', this)
    const result = await Dal[this.constructor.name].save(this)
    logger.debug('Saved: ', result)
    return result
  }

  async delete () {
    return this.constructor.delete(this.id)
  }

  static async delete (id) {
    return Dal[this.name].delete(id)
  }
}
