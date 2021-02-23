const Joi = require('@hapi/joi')
const BaseModel = require('./baseModel')
const { uuid } = require('../utils/utils')

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
    // Make sure there are no registrations linked to this person prior to deletion
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

    // Delete the corresponding person's address
    if (addressIdToDelete) {
      await Address.delete(addressIdToDelete)
    }
    return result
  }

  static validForPayment (person, options = {}) {
    const { skip = [] } = options
    if (!person) {
      return false
    }

    const { fullName, address, email } = person

    const { Address } = require('../models')
    if (!fullName || !Address.validForPayment(address)) {
      return false
    }

    if (!(email || skip.includes('email'))) {
      return false
    }

    return true
  }
}
