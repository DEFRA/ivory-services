const Joi = require('@hapi/joi')
const { dataStore } = require('../config')
const Dal = require(`./${dataStore}-dal`)

module.exports = class BaseModel {
  static get schema () {
    throw new Error(`The schema getter needs to be implemented within the ${this.name} class`)
  }

  constructor (data) {
    const { value, error } = Joi.validate(data, this.constructor.schema, { abortEarly: false })
    if (error) {
      throw new Error(`The constructor data is invalid. ${error.message}`)
    } else {
      Object.assign(this, value)
    }
  }

  static async getAll (query) {
    return Dal[this.name].findAll(query)
  }

  static async getById (id) {
    return Dal[this.name].find(id)
  }

  async save () {
    return Dal[this.constructor.name].save(this)
  }

  async delete () {
    return Dal[this.constructor.name].delete(this.id)
  }
}
