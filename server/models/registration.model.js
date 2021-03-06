const Joi = require('@hapi/joi')
const BaseModel = require('./baseModel')
const { uuid } = require('defra-hapi-utils').utils
const registrationNumberGenerator = require('../utils/registration-number-generator')

module.exports = class Registration extends BaseModel {
  static get params () {
    return {
      id: Joi.string().guid().example(uuid())
    }
  }

  static get schema () {
    return {
      id: Joi.string().guid().allow(null).optional().example(uuid()),
      itemId: Joi.string().guid().example(uuid()),
      ownerId: Joi.string().guid().example(uuid()),
      agentId: Joi.string().guid().example(uuid()),
      paymentId: Joi.string().guid().example(uuid()),
      registrationNumber: Joi.string(),
      agentActingAs: Joi.string(),
      confirmationSent: Joi.bool().allow(null).example(false),
      ownerType: Joi.string().example('someone-else'),
      dealingIntent: Joi.string(),
      status: Joi.string(),
      submittedDate: Joi.string()
    }
  }

  async save () {
    let personIdToDelete
    if (this.id) {
      // Switch the owner and agent when the ownerType is changed
      const { ownerType } = await Registration.getById(this.id) || {}
      if (ownerType && this.ownerType !== ownerType) {
        switch (this.ownerType) {
          case 'i-own-it': {
            personIdToDelete = this.ownerId
            this.ownerId = this.agentId || null
            this.agentId = null
            break
          }
          case 'someone-else': {
            this.agentId = this.ownerId || null
            this.ownerId = null
            break
          }
        }
      }
    }

    // Create registration number if required
    if (this.status === 'ready-for-payment' && !this.registrationNumber) {
      this.registrationNumber = await Registration.getUniqueRegistrationNumber()
    }

    const result = await super.save()
    if (personIdToDelete) {
      const { Person } = require('../models')
      await Person.delete(personIdToDelete)
    }
    return result
  }

  static async getUniqueRegistrationNumber () {
    const registrationNumber = await registrationNumberGenerator.random()
    const results = await Registration.getAll({ registrationNumber: this.registrationNumber })
    if (results.length) {
      return this.getUniqueRegistrationNumber()
    } else {
      return registrationNumber
    }
  }

  static validForPayment (registration) {
    if (!registration) {
      return false
    }

    const { item, owner, agent, ownerType, dealingIntent, status } = registration

    const { Item, Person } = require('../models')
    if (!status || !dealingIntent || !Item.validForPayment(item)) {
      return false
    }

    switch (ownerType) {
      case 'i-own-it': {
        if (agent || !Person.validForPayment(owner)) {
          return false
        }
        break
      }
      case 'someone-else': {
        if (!Person.validForPayment(agent) || !Person.validForPayment(owner, { skip: ['email'] })) {
          return false
        }
        break
      }
      default: return false
    }

    return true
  }
}
