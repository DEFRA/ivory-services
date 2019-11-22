const sinon = require('sinon')
const Lab = require('@hapi/lab')
// const Code = require('@hapi/code')
const lab = exports.lab = Lab.script()
const TestHelper = require('../test-helper')
const { startHandler } = require('./index')
const BaseDal = require('./dal/baseDal')
const BaseModel = require('./models/baseModel')
const { uuid } = require('defra-hapi-utils').utils

lab.experiment(TestHelper.getFile(__filename), () => {
  lab.beforeEach(({ context }) => {
    const sandbox = sinon.createSandbox()
    TestHelper.stubCommon(sandbox)
    sandbox.stub(BaseDal, 'createTable').value(() => undefined)
    sandbox.stub(BaseDal, 'dropTable').value(() => undefined)
    sandbox.stub(BaseModel.prototype, 'save').value(() => ({ id: uuid() }))
    context.sandbox = sandbox
  })

  lab.afterEach(async ({ context }) => {
    // Restore the sandbox to make sure the stubs are removed correctly
    context.sandbox.restore()
  })
  lab.test('StartHandler works correctly', async () => {
    startHandler({})
  })
})
