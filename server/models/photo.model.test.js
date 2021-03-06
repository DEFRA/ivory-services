const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const lab = exports.lab = Lab.script()
const TestHelper = require('../../test-helper')
const Photo = require('../models/photo.model')
const { uuid } = require('defra-hapi-utils').utils

const photo = {
  itemId: uuid(),
  filename: '1234567890.jpg',
  originalFilename: 'example.jpg'
}

lab.experiment(TestHelper.getFile(__filename), () => {
  let data

  lab.beforeEach(() => {
    data = Object.assign({}, photo)
  })

  TestHelper.modelTableTest(lab, Photo)

  lab.test('Photo data validates correctly', async () => {
    const { value } = Photo.validate(data, { abortEarly: false })
    Code.expect(value).to.equal(data)
  })

  Object.keys(photo).forEach((field) => {
    lab.test(`Photo data invalidates ${field} correctly`, async () => {
      data[field] = false
      const { error } = Photo.validate(data, { abortEarly: false })
      Code.expect(error.toString()).to.contain(TestHelper.invalidStringMessage(field))
    })
  })

  lab.test('Photo data invalidates unknown field correctly', async () => {
    data.unknown = 'blah'
    const { error } = Photo.validate(data, { abortEarly: false })
    Code.expect(error.toString()).to.contain('"unknown" is not allowed')
  })

  lab.test('Photo parameter validates correctly', async () => {
    const data = { id: 'abc' }
    const { error } = Photo.validateParams(data, { abortEarly: false })
    Code.expect(error.toString()).to.contain(TestHelper.invalidGuidMessage('id'))
  })
})
