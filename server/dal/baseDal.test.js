const sinon = require('sinon')
const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()
const Code = require('@hapi/code')
const utils = require('../utils/utils')
const TestHelper = require('../../test-helper')
const BaseDal = require('../dal/baseDal')
const Pool = require('../dal/inMemoryPg').Pool
const { uuid } = utils

lab.experiment(TestHelper.getFile(__filename), () => {
  lab.beforeEach(({ context }) => {
    const sandbox = sinon.createSandbox()
    TestHelper.stubCommon(sandbox)
    class Dal extends BaseDal {
      static get table () {
        return { id: 'uuid', type: 'varchar' }
      }
    }
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
    context.Dal = Dal
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
      lab.test('successfully retrieves all models filtered where type = "x"', async ({ context }) => {
        await context.Dal.findAll({ type: 'x' })
        Code.expect(context.getQueryText()).to.equal('SELECT * FROM "dal" WHERE type = \'x\'')
      })

      lab.test('successfully retrieves all models', async ({ context }) => {
        await context.Dal.findAll()
        Code.expect(context.getQueryText()).to.equal('SELECT * FROM "dal"')
      })
    })

    lab.experiment('find', () => {
      lab.test('successfully retrieves a model by id', async ({ context }) => {
        await context.Dal.find('b')
        Code.expect(context.getQueryText()).to.equal('SELECT * FROM "dal" WHERE id = \'b\'')
      })
    })

    lab.experiment('save', () => {
      lab.test('successfully creates a new model', async ({ context }) => {
        const { sandbox } = context
        const id = 'my-new-id'
        sandbox.stub(utils, 'uuid').value(() => id)
        await context.Dal.save({ type: 'z', foo: 'baa' })
        Code.expect(context.getQueryText()).to.equal('INSERT INTO "dal" (type, foo) VALUES ($1, $2) RETURNING *;')
        Code.expect(context.getDataArray()).to.equal(['z', 'baa'])
      })

      lab.test('successfully updates an existing model', async ({ context }) => {
        await context.Dal.save({ id: 'c', type: 'z' })
        Code.expect(context.getQueryText()).to.equal('UPDATE "dal" SET id = \'c\', type = \'z\' WHERE id = \'c\'; SELECT * FROM "dal" WHERE id = \'c\'')
      })

      lab.test('successfully updates an existing model when nulls are included', async ({ context }) => {
        await context.Dal.save({ id: 'c', type: null })
        Code.expect(context.getQueryText()).to.equal('UPDATE "dal" SET id = \'c\', type = null WHERE id = \'c\'; SELECT * FROM "dal" WHERE id = \'c\'')
      })
    })

    lab.experiment('delete', () => {
      lab.test('successfully deletes a model', async ({ context }) => {
        await context.Dal.delete('c')
        Code.expect(context.getQueryText()).to.equal('DELETE FROM "dal" WHERE id = \'c\'')
      })
    })

    lab.experiment('dalToModel', () => {
      lab.test('successfully converts rows of data', async ({ context }) => {
        class Dal extends BaseDal {
          static get table () {
            return {
              myId: 'uuid constraint choice_group_id_fk references "group"',
              myInteger: 'integer',
              myIntegerWithNull: 'integer',
              myIntegerDefaultingToZero: 'integer default 0',
              myNoNullString: 'varchar not null',
              myNullAllowedString: 'varchar not null'
            }
          }
        }
        const data = {
          myid: uuid(),
          myinteger: 10,
          myintegerwithnull: null,
          myintegerdefaultingtozero: null,
          mynonullstring: 'some text',
          mynullallowedstring: null
        }
        const model = await Dal.dalToModel([data])
        Code.expect(model).to.equal([{
          myId: data.myid,
          myInteger: data.myinteger,
          myNoNullString: data.mynonullstring
        }])
      })
    })
  })
})
