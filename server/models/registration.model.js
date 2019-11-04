const Joi = require('@hapi/joi')
const BaseModel = require('./baseModel')
const { uuid } = require('ivory-shared').utils

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
      ownerType: Joi.string().example('agent'),
      dealingIntent: Joi.string(),
      status: Joi.string()
    }
  }

  async save () {
    let personIdToDelete
    if (this.id) {
      const { ownerType } = await Registration.getById(this.id) || {}
      // Switch the owner and agent when the ownerType is changed
      if (ownerType && this.ownerType !== ownerType) {
        switch (this.ownerType) {
          case 'agent': {
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
    const result = await super.save()
    if (personIdToDelete) {
      const { Person } = require('../models')
      await Person.delete(personIdToDelete)
    }
    return result
  }
}
