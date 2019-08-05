const sinon = require('sinon')
const Code = require('@hapi/code')
const Boom = require('@hapi/boom')
const dotenv = require('dotenv')
const config = require('./server/config')
const { logger } = require('defra-logging-facade')
const routesPlugin = require('./server/plugins/hapi-router')
const { uuid } = require('ivory').utils

const UNKNOWN_GUID = uuid()
const INVALID_GUID = 'INVALID-GUID'

// Suppress MaxListenersExceededWarning within tests
require('events').EventEmitter.defaultMaxListeners = Infinity

module.exports = class TestHelper {
  constructor (lab, testFile, options) {
    const { stubCallback, mocks } = options || {}

    lab.beforeEach(async ({ context }) => {
      // Add env variables
      process.env.LOG_LEVEL = 'error'

      // Add mocks to the context
      context.mocks = mocks

      // Create a sinon sandbox to stub methods
      context.sandbox = sinon.createSandbox()

      // Stub common methods
      TestHelper.stubCommon(context.sandbox)

      // Stub any methods specific to the test
      if (stubCallback) {
        stubCallback(context.sandbox)
      }

      // Stub the routes to include only the tested route derived from the test filename
      const routes = TestHelper.getFile(testFile).replace('.test.js', '.js').substr(1)
      context.sandbox.stub(routesPlugin, 'options').value({ routes })

      context.server = await require('./server')()
    })

    lab.afterEach(async ({ context }) => {
      const { server, sandbox } = context

      // Restore the sandbox to make sure the stubs are removed correctly
      sandbox.restore()

      // Stop the server
      await server.stop()

      // Remove env variables
      delete process.env.LOG_LEVEL
    })
  }

  static createRoutesHelper (...args) {
    return new TestHelper(...args)
  }

  static testResponse (actual, expected) {
    Code.expect(actual.statusCode).to.equal(expected.statusCode)
    Code.expect(actual.headers['content-type']).to.include('application/json')
    Code.expect(JSON.parse(actual.payload)).to.equal(expected.payload)
  }

  /** ************************* GET All **************************** **/
  getRequestTests ({ lab, Model, url }, requestTestsCallback) {
    lab.experiment(`GET ${url}`, () => {
      lab.beforeEach(({ context }) => {
        context.request = () => ({
          method: 'GET',
          url
        })
      })

      lab.test('responds with all models', async ({ context }) => {
        const { mocks, request, server, sandbox } = context
        sandbox.stub(Model, 'getAll').value(async () => [mocks.model])

        TestHelper.testResponse(await server.inject(request()), {
          statusCode: 200,
          payload: [mocks.model]
        })
      })

      lab.test('responds with "Bad Implementation" when the request throws an error', async ({ context }) => {
        const { request, server, sandbox } = context
        sandbox.stub(Model, 'getAll').value(async () => {
          throw new Error('failure')
        })

        TestHelper.testResponse(await server.inject(request()), Boom.badImplementation().output)
      })

      if (requestTestsCallback) {
        requestTestsCallback()
      }
    })
  }

  /** ************************* GET By Id **************************** **/
  getByIdRequestTests ({ lab, Model, url }, requestTestsCallback) {
    lab.experiment(`GET ${url}/{id}`, () => {
      lab.beforeEach(({ context }) => {
        context.request = (id) => ({
          method: 'GET',
          url: `${url}/${id}`
        })
      })

      lab.test('responds with the existing model when {id} is an existing guid', async ({ context }) => {
        const { mocks, request, server, sandbox } = context
        sandbox.stub(Model, 'getById').value(async () => mocks.model)

        TestHelper.testResponse(await server.inject(request(mocks.id)), {
          statusCode: 200,
          payload: mocks.model
        })
      })

      lab.test('responds with "Not Found" when {id} is an unknown guid', async ({ context }) => {
        const { request, server, sandbox } = context
        sandbox.stub(Model, 'getById').value(async () => undefined)

        TestHelper.testResponse(await server.inject(request(UNKNOWN_GUID)), Boom.notFound().output)
      })

      lab.test('responds with "Bad Data" when {id} is an invalid guid', async ({ context }) => {
        const { request, server } = context
        TestHelper.testResponse(await server.inject(request(INVALID_GUID)), Boom.badData(TestHelper.invalidGuidMessage('id')).output)
      })

      lab.test('responds with "Bad Implementation" when the request throws an error', async ({ context }) => {
        const { mocks, request, server, sandbox } = context
        sandbox.stub(Model, 'getById').value(async () => {
          throw new Error('failure')
        })

        TestHelper.testResponse(await server.inject(request(mocks.id)), Boom.badImplementation().output)
      })

      if (requestTestsCallback) {
        requestTestsCallback()
      }
    })
  }

  /** ************************* POST **************************** **/
  postRequestTests ({ lab, Model, url }, requestTestsCallback) {
    lab.experiment(`POST ${url}`, () => {
      lab.beforeEach(({ context }) => {
        context.request = (data) => ({
          method: 'POST',
          url,
          payload: data
        })
      })

      lab.test(`responds with the added ${Model.name}`, async ({ context }) => {
        const { mocks, request, server, sandbox } = context
        sandbox.stub(Model.prototype, 'save').value(async () => mocks.model)

        TestHelper.testResponse(await server.inject(request(mocks.model)), {
          statusCode: 200,
          payload: mocks.model
        })
      })

      lab.test('responds with "Bad Implementation" when the request throws an error', async ({ context }) => {
        const { mocks, request, server, sandbox } = context
        sandbox.stub(Model.prototype, 'save').value(async () => {
          throw new Error('failure')
        })

        TestHelper.testResponse(await server.inject(request(mocks.model)), Boom.badImplementation().output)
      })

      if (requestTestsCallback) {
        requestTestsCallback()
      }
    })
  }

  /** ************************* PATCH **************************** **/
  patchRequestTests ({ lab, Model, url }, requestTestsCallback) {
    lab.experiment(`PATCH ${url}/{id}`, () => {
      lab.beforeEach(({ context }) => {
        // Create PATCH request
        context.request = (id, data) => {
          return {
            method: 'PATCH',
            url: `${url}/${id}`,
            payload: data
          }
        }
      })

      lab.test('responds with the updated model when {id} is an existing guid', async ({ context }) => {
        const { mocks, request, server, sandbox } = context
        sandbox.stub(Model, 'getById').value(async () => mocks.model)
        sandbox.stub(Model.prototype, 'save').value(async () => mocks.model)

        TestHelper.testResponse(await server.inject(request(mocks.id, mocks.model)), {
          statusCode: 200,
          payload: mocks.model
        })
      })

      lab.test('responds with "Not Found" when {id} is an unknown guid', async ({ context }) => {
        const { mocks, request, server, sandbox } = context
        sandbox.stub(Model, 'getById').value(async () => undefined)

        TestHelper.testResponse(await server.inject(request(UNKNOWN_GUID, mocks.model)), Boom.notFound().output)
      })

      lab.test('responds with "Bad Data" when {id} is an invalid guid', async ({ context }) => {
        const { mocks, request, server } = context
        TestHelper.testResponse(await server.inject(request(INVALID_GUID, mocks.model)), Boom.badData(TestHelper.invalidGuidMessage('id')).output)
      })

      lab.test('responds with "Bad Implementation" when the request throws an error', async ({ context }) => {
        const { mocks, request, server, sandbox } = context
        sandbox.stub(Model, 'getById').value(async () => {
          throw new Error('failure')
        })

        TestHelper.testResponse(await server.inject(request(mocks.id, mocks.model)), Boom.badImplementation().output)
      })

      if (requestTestsCallback) {
        requestTestsCallback()
      }
    })
  }

  /** ************************* DELETE **************************** **/
  deleteRequestTests ({ lab, Model, url }, requestTestsCallback) {
    lab.experiment(`DELETE ${url}/{id}`, () => {
      lab.beforeEach(({ context }) => {
        // Create DELETE request
        context.request = (id) => {
          return {
            method: 'DELETE',
            url: `${url}/${id}`
          }
        }
      })

      lab.test('responds with the existing model when {id} is an existing guid', async ({ context }) => {
        const { mocks, request, server, sandbox } = context
        sandbox.stub(Model, 'getById').value(async () => mocks.model)
        sandbox.stub(Model.prototype, 'delete').value(async () => true)

        TestHelper.testResponse(await server.inject(request(mocks.id)), {
          statusCode: 200,
          payload: true
        })
      })

      lab.test('responds with "Not Found" when {id} is an unknown guid', async ({ context }) => {
        const { request, server, sandbox } = context
        sandbox.stub(Model, 'getById').value(async () => undefined)

        TestHelper.testResponse(await server.inject(request(UNKNOWN_GUID)), Boom.notFound().output)
      })

      lab.test('responds with "Bad Data" when {id} is an invalid guid', async ({ context }) => {
        const { request, server } = context
        TestHelper.testResponse(await server.inject(request(INVALID_GUID)), Boom.badData(TestHelper.invalidGuidMessage('id')).output)
      })

      lab.test('responds with "Bad Implementation" when the request throws an error', async ({ context }) => {
        const { mocks, request, server, sandbox } = context
        sandbox.stub(Model, 'getById').value(async () => {
          throw new Error('failure')
        })
        TestHelper.testResponse(await server.inject(request(mocks.id)), Boom.badImplementation().output)
      })

      if (requestTestsCallback) {
        requestTestsCallback()
      }
    })
  }

  /** ************************************************************* **/

  static stubCommon (sandbox) {
    sandbox.stub(dotenv, 'config').value(() => {})
    sandbox.stub(config, 'airbrakeEnabled').value(false)
    sandbox.stub(config, 'postgresEnabled').value(false)
    sandbox.stub(logger, 'debug').value(() => undefined)
    sandbox.stub(logger, 'info').value(() => undefined)
    sandbox.stub(logger, 'warn').value(() => undefined)
    sandbox.stub(logger, 'error').value(() => undefined)
    sandbox.stub(logger, 'serverError').value(() => undefined)
    sandbox.stub(config, 'logLevel').value('error')
  }

  static getFile (filename) {
    return filename.substring(__dirname.length)
  }

  static invalidGuidMessage (prop) {
    return `child "${prop}" fails because ["${prop}" must be a valid GUID]`
  }

  static invalidEmailMessage (prop) {
    return `child "${prop}" fails because ["${prop}" must be a valid email]`
  }

  static invalidNumberMessage (prop) {
    return `child "${prop}" fails because ["${prop}" must be a number]`
  }

  static invalidStringMessage (prop) {
    return `child "${prop}" fails because ["${prop}" must be a string]`
  }

  static invalidBooleanMessage (prop) {
    return `child "${prop}" fails because ["${prop}" must be a boolean]`
  }

  static emptyMessage (prop) {
    return `child "${prop}" fails because ["${prop}" is not allowed to be empty]`
  }
}
