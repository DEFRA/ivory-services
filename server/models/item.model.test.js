const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const Joi = require('@hapi/joi')
const lab = exports.lab = Lab.script()
const TestHelper = require('../../test-helper')
const Item = require('../models/item.model')

const item = {
  description: 'item description',
  itemType: 'item-type',
  ageExemptionDeclaration: true,
  ageExemptionDescription: 'age exemption',
  volumeExemptionDeclaration: true,
  volumeExemptionDescription: 'volume exemption'
}

lab.experiment(TestHelper.getFile(__filename), () => {
  let data

  lab.beforeEach(() => {
    data = Object.assign({}, item)
  })

  TestHelper.modelTableTest(lab, Item)

  lab.test('Item data validates correctly', async () => {
    const { value } = Joi.validate(data, Item.schema, { abortEarly: false })
    Code.expect(value).to.equal(data)
  })

  Object.keys(item).forEach((field) => {
    lab.test(`Item data invalidates ${field} correctly`, async () => {
      let val = false
      let testError = TestHelper.invalidStringMessage(field)
      if (field.endsWith('Declaration')) {
        val = 'invalid-data'
        testError = TestHelper.invalidBooleanMessage(field)
      }
      data[field] = val
      const { error } = Joi.validate(data, Item.schema, { abortEarly: false })
      Code.expect(error.toString()).to.contain(testError)
    })
  })

  lab.test('Item data invalidates unknown field correctly', async () => {
    data.unknown = 'blah'
    const { error } = Joi.validate(data, Item.schema, { abortEarly: false })
    Code.expect(error.toString()).to.contain('"unknown" is not allowed')
  })

  lab.test('Item parameter validate correctly', async () => {
    const data = { id: 'abc' }
    const { error } = Joi.validate(data, Item.params, { abortEarly: false })
    Code.expect(error.toString()).to.contain(TestHelper.invalidGuidMessage('id'))
  })
})
