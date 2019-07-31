const sinon = require('sinon')
const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()
const Code = require('@hapi/code')
const utils = require('../lib/utils')
const TestHelper = require('../../test-helper')
const BaseDal = require('../dal/baseDal')

lab.experiment(TestHelper.getFile(__filename), () => {
  lab.beforeEach(({ context }) => {
    const sandbox = sinon.createSandbox()
    TestHelper.stubCommon(sandbox)
    Object.assign(BaseDal, {
      dataStore: {
        a: { id: 'a', type: 'x' },
        b: { id: 'b', type: 'y' },
        c: { id: 'c', type: 'x' }
      }
    })
    context.sandbox = sandbox
  })

  lab.afterEach(async ({ context }) => {
    // Restore the sandbox to make sure the stubs are removed correctly
    context.sandbox.restore()
  })

  lab.experiment('BaseDal', () => {
    lab.beforeEach(({ context }) => {
      const { sandbox } = context
      sandbox.stub(utils, 'uuid').value(() => 'd')
    })

    lab.experiment('findAll', () => {
      lab.test(`successfully retrieves all models filtered where type = "x"`, async () => {
        const result = await BaseDal.findAll({ type: 'x' })
        Code.expect(result).to.equal([{ id: 'a', type: 'x' }, { id: 'c', type: 'x' }])
        Code.expect(Object.keys(BaseDal.dataStore)).to.equal(['a', 'b', 'c'])
      })

      lab.test(`successfully retrieves all models`, async () => {
        const result = await BaseDal.findAll()
        Code.expect(result).to.equal([{ id: 'a', type: 'x' }, { id: 'b', type: 'y' }, { id: 'c', type: 'x' }])
        Code.expect(Object.keys(BaseDal.dataStore)).to.equal(['a', 'b', 'c'])
      })
    })

    lab.experiment('find', () => {
      lab.test(`successfully retrieves a model by id`, async () => {
        const result = await BaseDal.find('b')
        Code.expect(result).to.equal({ id: 'b', type: 'y' })
        Code.expect(Object.keys(BaseDal.dataStore)).to.equal(['a', 'b', 'c'])
      })
    })

    lab.experiment('save', () => {
      lab.test(`successfully creates a new model`, async ({ context }) => {
        const { sandbox } = context
        const id = 'my-new-id'
        sandbox.stub(utils, 'uuid').value(() => id)
        const result = await BaseDal.save({ type: 'z' })
        Code.expect(result).to.equal({ id, type: 'z' })
        Code.expect(Object.keys(BaseDal.dataStore)).to.equal(['a', 'b', 'c', id])
      })

      lab.test(`successfully updates an existing model`, async () => {
        const result = await BaseDal.save({ id: 'c', type: 'z' })
        Code.expect(result).to.equal({ id: 'c', type: 'z' })
        Code.expect(Object.keys(BaseDal.dataStore)).to.equal(['a', 'b', 'c'])
      })
    })

    lab.experiment('delete', () => {
      lab.test(`successfully deletes a model`, async () => {
        const result = await BaseDal.delete('c')
        Code.expect(result).to.equal(true)
        Code.expect(Object.keys(BaseDal.dataStore)).to.equal(['a', 'b'])
      })
    })

    lab.experiment('delete', () => {
      lab.test(`fails to find and delete a model`, async () => {
        const result = await BaseDal.delete('x')
        Code.expect(result).to.equal(false)
        Code.expect(Object.keys(BaseDal.dataStore)).to.equal(['a', 'b', 'c'])
      })
    })
  })
})
