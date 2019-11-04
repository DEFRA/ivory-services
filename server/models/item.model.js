const Joi = require('@hapi/joi')
const BaseModel = require('./baseModel')
const { uuid } = require('ivory-shared').utils

module.exports = class Item extends BaseModel {
  static get params () {
    return {
      id: Joi.string().guid().example(uuid())
    }
  }

  static get schema () {
    return {
      id: Joi.string().guid().allow(null).optional().example(uuid()),
      itemType: Joi.string().allow(null),
      description: Joi.string().allow(null),
      ageExemptionDeclaration: Joi.bool().allow(null).example(false),
      ageExemptionDescription: Joi.string().allow(null),
      volumeExemptionDeclaration: Joi.bool().allow(null).example(false),
      volumeExemptionDescription: Joi.string().allow(null)
    }
  }

  async save () {
    if (this.id) {
      const prev = await Item.getById(this.id)
      // Clear the item declaration data when the item type changes as it's now irrelevant
      if (this.itemType !== prev.itemType) {
        this.ageExemptionDeclaration = null
        this.ageExemptionDescription = null
        this.volumeExemptionDeclaration = null
        this.volumeExemptionDescription = null
      }
    }
    return super.save()
  }
}
