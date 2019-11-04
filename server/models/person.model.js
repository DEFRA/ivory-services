const Joi = require('@hapi/joi')
const BaseModel = require('./baseModel')
const { uuid } = require('ivory-shared').utils

module.exports = class Person extends BaseModel {
  static get params () {
    return {
      id: Joi.string().guid().example(uuid())
    }
  }

  static get schema () {
    return {
      id: Joi.string().guid().allow(null).optional().example(uuid()),
      fullName: Joi.string().example('Jon Doe'),
      email: Joi.string().email().example('jon.doe@test.defra.net'),
      addressId: Joi.string().guid().example(uuid())
    }
  }

  static async delete (id) {
    // Make sure the person will be an orphan prior to deletion
    const { Registration, Address } = require('../models')
    const [ownerRegistrations, agentRegistrations] = await Promise.all([
      Registration.getAll({ ownerId: id }),
      Registration.getAll({ agentId: id })
    ])
    if (ownerRegistrations.length || agentRegistrations.length) {
      return false
    }
    const person = await Person.getById(id)
    const addressIdToDelete = person.addressId
    const result = await super.delete(id)
    // Delete the corresponding address
    if (addressIdToDelete) {
      await Address.delete(addressIdToDelete)
    }
    return result
  }
}
