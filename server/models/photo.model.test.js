const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const Joi = require('@hapi/joi')
const lab = exports.lab = Lab.script()
const TestHelper = require('../../test-helper')
const Photo = require('../models/photo.model')
const { uuid } = require('ivory-shared').utils

const photo = {
  itemId: uuid(),
  filename: '1234567890.jpg'
}

lab.experiment(TestHelper.getFile(__filename), () => {
  let data

  lab.beforeEach(() => {
    data = Object.assign({}, photo)
  })

  TestHelper.modelTableTest(lab, Photo)

  lab.test('Photo data validates correctly', async () => {
    const { value } = Joi.validate(data, Photo.schema, { abortEarly: false })
    Code.expect(value).to.equal(data)
  })

  Object.keys(photo).forEach((field) => {
    lab.test(`Photo data invalidates ${field} correctly`, async () => {
      data[field] = false
      const { error } = Joi.validate(data, Photo.schema, { abortEarly: false })
      Code.expect(error.toString()).to.contain(TestHelper.invalidStringMessage(field))
    })
  })

  lab.test('Photo data invalidates unknown field correctly', async () => {
    data.unknown = 'blah'
    const { error } = Joi.validate(data, Photo.schema, { abortEarly: false })
    Code.expect(error.toString()).to.contain('"unknown" is not allowed')
  })

  lab.test('Photo parameter validates correctly', async () => {
    const data = { id: 'abc' }
    const { error } = Joi.validate(data, Photo.params, { abortEarly: false })
    Code.expect(error.toString()).to.contain(TestHelper.invalidGuidMessage('id'))
  })
})
