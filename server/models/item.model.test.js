const sinon = require('sinon')
const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const lab = exports.lab = Lab.script()
const TestHelper = require('../../test-helper')
const Item = require('../models/item.model')
const Dal = require('../dal')
const { uuid } = require('ivory-shared').utils

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

  lab.beforeEach(({ context }) => {
    data = Object.assign({}, item)
    const sandbox = sinon.createSandbox()
    TestHelper.stubCommon(sandbox)
    context.sandbox = sandbox
    context.data = data
    sandbox.stub(Dal.Item, 'find').value(() => new Item(data))
    sandbox.stub(Dal.Item, 'save').value((data) => data)
  })

  lab.afterEach(async ({ context }) => {
    // Restore the sandbox to make sure the stubs are removed correctly
    context.sandbox.restore()
  })

  TestHelper.modelTableTest(lab, Item)

  lab.test('Item data validates correctly', async () => {
    const { value } = Item.validate(data, { abortEarly: false })
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
      const { error } = Item.validate(data, { abortEarly: false })
      Code.expect(error.toString()).to.contain(testError)
    })
  })

  lab.test('Item data invalidates unknown field correctly', async () => {
    data.unknown = 'blah'
    const { error } = Item.validate(data, { abortEarly: false })
    Code.expect(error.toString()).to.contain('"unknown" is not allowed')
  })

  lab.test('Item parameter validate correctly', async () => {
    const data = { id: 'abc' }
    const { error } = Item.validateParams(data, { abortEarly: false })
    Code.expect(error.toString()).to.contain(TestHelper.invalidGuidMessage('id'))
  })

  lab.test('Item declaration data is set to null if the item type is changed', async () => {
    data.id = uuid()
    const item = await Item.getById()
    item.itemType = 'changed-item-type'
    await item.save()
    Code.expect(item).to.equal({
      description: data.description,
      itemType: 'changed-item-type',
      ageExemptionDeclaration: null,
      ageExemptionDescription: null,
      volumeExemptionDeclaration: null,
      volumeExemptionDescription: null,
      id: data.id
    })
  })
})
