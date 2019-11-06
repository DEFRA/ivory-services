const Joi = require('@hapi/joi')
const BaseModel = require('./baseModel')
const { uuid } = require('ivory-shared').utils

module.exports = class Address extends BaseModel {
  static get params () {
    return {
      id: Joi.string().guid().example(uuid())
    }
  }

  static get schema () {
    return {
      id: Joi.string().guid().allow(null).optional().example(uuid()),
      businessName: Joi.string().allow(null, '').optional(),
      addressLine1: Joi.string(),
      addressLine2: Joi.string().allow(null, '').optional(),
      town: Joi.string(),
      county: Joi.string().allow(null, '').optional(),
      postcode: Joi.string().example('WA4 1AB'),
      country: Joi.string().allow(null, '').optional(),
      uprn: Joi.string()
    }
  }

  async delete () {
    // Make sure there are no people linked to this address prior to deletion
    const { Person } = require('../models')
    const people = Person.getAll({ addressId: this.id })
    if (people.length) {
      return false
    }
    return super.delete()
  }

  static validForPayment (address) {
    if (!address) {
      return false
    }

    const { addressLine1, town, postcode } = address

    if (!addressLine1 || !town || !postcode) {
      return false
    }

    return true
  }
}
