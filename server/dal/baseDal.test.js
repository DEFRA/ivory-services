const sinon = require('sinon')
const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()
const Code = require('@hapi/code')
const { utils } = require('ivory-shared')
const TestHelper = require('../../test-helper')
const BaseDal = require('../dal/baseDal')
const Pool = require('../dal/inMemoryPg').Pool

lab.experiment(TestHelper.getFile(__filename), () => {
  lab.beforeEach(({ context }) => {
    const sandbox = sinon.createSandbox()
    TestHelper.stubCommon(sandbox)
    Object.assign(BaseDal, {
      table: { id: 'uuid', type: 'varchar' }
    })
    let text = ''
    let data = []
    sandbox.stub(Pool.prototype, 'query').value(async (queryText, dataArray) => {
      if (text) {
        text += '; '
      }
      if (dataArray) {
        data = dataArray
      }
      text += queryText
      return { rows: [{}] }
    })
    context.sandbox = sandbox
    context.getQueryText = () => text.trim()
    context.getDataArray = () => data
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
      lab.test(`successfully retrieves all models filtered where type = "x"`, async ({ context }) => {
        await BaseDal.findAll({ type: 'x' })
        Code.expect(context.getQueryText()).to.equal(`SELECT * FROM "basedal" WHERE type = 'x'`)
      })

      lab.test(`successfully retrieves all models`, async ({ context }) => {
        await BaseDal.findAll()
        Code.expect(context.getQueryText()).to.equal(`SELECT * FROM "basedal"`)
      })
    })

    lab.experiment('find', () => {
      lab.test(`successfully retrieves a model by id`, async ({ context }) => {
        await BaseDal.find('b')
        Code.expect(context.getQueryText()).to.equal(`SELECT * FROM "basedal" WHERE id = 'b'`)
      })
    })

    lab.experiment('save', () => {
      lab.test(`successfully creates a new model`, async ({ context }) => {
        const { sandbox } = context
        const id = 'my-new-id'
        sandbox.stub(utils, 'uuid').value(() => id)
        await BaseDal.save({ type: 'z', foo: 'baa' })
        Code.expect(context.getQueryText()).to.equal(`INSERT INTO "basedal" (type, foo) VALUES ($1, $2) RETURNING *;`)
        Code.expect(context.getDataArray()).to.equal(['z', 'baa'])
      })

      lab.test(`successfully updates an existing model`, async ({ context }) => {
        await BaseDal.save({ id: 'c', type: 'z' })
        Code.expect(context.getQueryText()).to.equal(`UPDATE "basedal" SET id = 'c', type = 'z' WHERE id = 'c'; SELECT * FROM "basedal" WHERE id = 'c'`)
      })
    })

    lab.experiment('delete', () => {
      lab.test(`successfully deletes a model`, async ({ context }) => {
        await BaseDal.delete('c')
        Code.expect(context.getQueryText()).to.equal(`DELETE FROM "basedal" WHERE id = 'c'`)
      })
    })
  })
})
