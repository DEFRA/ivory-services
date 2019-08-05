const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const Joi = require('@hapi/joi')
const lab = exports.lab = Lab.script()
const TestHelper = require('../../test-helper')
const Choice = require('../models/choice.model')
const { uuid } = require('ivory').utils

const choice = {
  groupId: uuid(),
  rank: 1,
  label: 'Choice label',
  heading: 'Choice heading',
  shortName: 'Choice shortname',
  hint: 'Choice hint',
  value: true
}

lab.experiment(TestHelper.getFile(__filename), () => {
  let data

  lab.beforeEach(() => {
    data = Object.assign({}, choice)
  })

  lab.test('Choice data validates correctly', async () => {
    const { value } = Joi.validate(data, Choice.schema, { abortEarly: false })
    Code.expect(value).to.equal(data)
  })

  Object.keys(choice).forEach((field) => {
    lab.test(`Choice data invalidates ${field} correctly`, async () => {
      data[field] = false
      const { error } = Joi.validate(data, Choice.schema, { abortEarly: false })
      switch (field) {
        case 'rank':
          Code.expect(error.toString()).to.contain(TestHelper.invalidNumberMessage(field))
          break
        case 'value':
          break // skip value because it's optional and can be anything
        default:
          Code.expect(error.toString()).to.contain(TestHelper.invalidStringMessage(field))
      }
    })
  })

  lab.test(`Choice data invalidates unknown field correctly`, async () => {
    data.unknown = 'blah'
    const { error } = Joi.validate(data, Choice.schema, { abortEarly: false })
    Code.expect(error.toString()).to.contain(`"unknown" is not allowed`)
  })

  lab.test('Choice parameter validate correctly', async () => {
    const data = { id: 'abc' }
    const { error } = Joi.validate(data, Choice.params, { abortEarly: false })
    Code.expect(error.toString()).to.contain(TestHelper.invalidGuidMessage('id'))
  })
})
