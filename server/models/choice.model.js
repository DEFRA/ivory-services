const Joi = require('@hapi/joi')
const BaseModel = require('./baseModel')
const { uuid } = require('../utils/utils')

module.exports = class Choice extends BaseModel {
  static get params () {
    return {
      id: Joi.string().guid().example(uuid())
    }
  }

  static get schema () {
    return {
      id: Joi.string().guid().allow(null).optional().example(uuid()),
      groupId: Joi.string().guid().example(uuid()),
      rank: Joi.number().example(10),
      label: Joi.string().example('label'),
      heading: Joi.string().example('heading'),
      shortName: Joi.string().example('short-name'),
      display: Joi.string().example('display'),
      ageExemptionDeclaration: Joi.string().example('age-exemption-declaration'),
      volumeExemptionDeclaration: Joi.string().example('volume-exemption-declaration'),
      ageExemptionLabel: Joi.string().example('age-exemption-explanation'),
      volumeExemptionLabel: Joi.string().example('volume-exemption-explanation'),
      hint: Joi.string().example('hint'),
      value: Joi.optional()
    }
  }
}
