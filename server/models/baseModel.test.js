const sinon = require('sinon')
const Joi = require('@hapi/joi')
const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()
const Code = require('@hapi/code')
const TestHelper = require('../../test-helper')
const Dal = require('../dal')
const BaseDal = require('../dal/baseDal')
const BaseModel = require('./baseModel')

lab.experiment(TestHelper.getFile(__filename), () => {
  let model
  let allModels

  const schema = { data: Joi.string() }

  lab.beforeEach(({ context }) => {
    const sandbox = sinon.createSandbox()
    TestHelper.stubCommon(sandbox)
    context.sandbox = sandbox
  })

  lab.afterEach(async ({ context }) => {
    // Restore the sandbox to make sure the stubs are removed correctly
    context.sandbox.restore()
  })

  lab.experiment('BaseModel without a valid schema set', () => {
    lab.experiment('constructor', () => {
      lab.test(`fails to instantiate due to bad data`, async () => {
        let model
        let error

        try {
          model = new BaseModel({ invalidProperty: 'invalid' })
        } catch (err) {
          error = err
        }

        Code.expect(model).to.equal(undefined)
        Code.expect(error)
          .to
          .equal(new Error(
            'The schema getter needs to be implemented within the BaseModel class'))
      })
    })
  })

  lab.experiment('BaseModel with a valid schema set', () => {
    lab.beforeEach(({ context }) => {
      const { sandbox } = context
      sandbox.stub(BaseModel, 'schema').get(() => schema)
      sandbox.stub(BaseDal, 'findAll').value(() => allModels)
      sandbox.stub(BaseDal, 'find').value(() => model)
      sandbox.stub(BaseDal, 'save').value(() => model)
      sandbox.stub(BaseDal, 'delete').value(() => model)

      // Fudge that adds an entry in the Dal of BaseModel that is the class BaseDal so that Dal[Model.name] will work in BaseModel
      Object.assign(Dal, { BaseModel: BaseDal })
    })

    lab.experiment('constructor', () => {
      lab.test(`fails to instantiate due to bad data`, async () => {
        let model
        let error

        try {
          model = new BaseModel({ invalidProperty: 'invalid' })
        } catch (err) {
          error = err
        }

        Code.expect(model).to.equal(undefined)
        Code.expect(error)
          .to
          .equal(new Error(
            'The constructor data is invalid. "invalidProperty" is not allowed'))
      })
    })

    lab.experiment('getAll', () => {
      lab.test(`successfully retrieves all models`, async () => {
        allModels = ['a', 'b', 'c']
        const results = await BaseModel.getAll({})
        Code.expect(results).to.equal(allModels)
      })
    })

    lab.experiment('getById', () => {
      lab.test(`successfully retrieves a model by id`, async () => {
        model = new BaseModel({ data: 'some data' })
        const result = await BaseModel.getById()
        Code.expect(result).to.equal(model)
      })
    })

    lab.experiment('save', () => {
      lab.test(`successfully saves a model`, async () => {
        model = new BaseModel({ data: 'some data' })
        const result = await model.save()
        Code.expect(result).to.equal(model)
      })
    })

    lab.experiment('delete', () => {
      lab.test(`successfully deletes a model`, async () => {
        model = new BaseModel({ data: 'some data' })
        const result = await model.delete()
        Code.expect(result).to.equal(model)
      })
    })
  })
})
