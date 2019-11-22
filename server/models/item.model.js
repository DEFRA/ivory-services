const Joi = require('@hapi/joi')
const BaseModel = require('./baseModel')
const { uuid } = require('defra-hapi-utils').utils

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

  static validForPayment (item) {
    if (!item) {
      return false
    }

    const { itemType, description, ageExemptionDeclaration, ageExemptionDescription, volumeExemptionDeclaration, volumeExemptionDescription } = item

    if (!description) {
      return false
    }

    switch (itemType) {
      // Declarations unnecessary when selling or hiring to a museum
      case 'sell-or-hire-to-museum': {
        if (ageExemptionDescription || ageExemptionDeclaration || volumeExemptionDeclaration || volumeExemptionDescription) {
          return false
        }
        break
      }

      // Declarations necessary when not selling or not hiring to a museum
      case 'musical-pre-1975-less-than-20-percent':
      case 'pre-1947-less-than-10-percent':
      case 'portrait-miniature-pre-1918': {
        if (!ageExemptionDescription || !ageExemptionDeclaration || !volumeExemptionDeclaration || !volumeExemptionDescription) {
          return false
        }
        break
      }

      default: return false
    }

    return true
  }
}
