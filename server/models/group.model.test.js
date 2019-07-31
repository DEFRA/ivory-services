const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const Joi = require('@hapi/joi')
const lab = exports.lab = Lab.script()
const TestHelper = require('../../test-helper')
const Group = require('../models/group.model')

const group = {
  type: 'Group type',
  title: 'Group title',
  description: 'Group description',
  hint: 'Group hint',
  multiple: true
}

lab.experiment(TestHelper.getFile(__filename), () => {
  let data

  lab.beforeEach(() => {
    data = Object.assign({}, group)
  })

  lab.test('Group data validates correctly', async () => {
    const { value } = Joi.validate(data, Group.schema, { abortEarly: false })
    Code.expect(value).to.equal(data)
  })

  Object.keys(group).forEach((field) => {
    lab.test(`Group data invalidates ${field} correctly`, async () => {
      data[field] = 1234
      const { error } = Joi.validate(data, Group.schema, { abortEarly: false })
      switch (field) {
        case 'multiple':
          Code.expect(error.toString()).to.contain(TestHelper.invalidBooleanMessage(field))
          break
        default:
          Code.expect(error.toString()).to.contain(TestHelper.invalidStringMessage(field))
      }
    })
  })

  lab.test(`Group data invalidates unknown field correctly`, async () => {
    data.unknown = 'blah'
    const { error } = Joi.validate(data, Group.schema, { abortEarly: false })
    Code.expect(error.toString()).to.contain(`"unknown" is not allowed`)
  })

  lab.test('Group parameter validate correctly', async () => {
    const data = { id: 'abc' }
    const { error } = Joi.validate(data, Group.params, { abortEarly: false })
    Code.expect(error.toString()).to.contain(TestHelper.invalidGuidMessage('id'))
  })
})
