const Boom = require('@hapi/boom')
const Joi = require('@hapi/joi')
const config = require('../config')
const cors = (config.isDev || config.isTest)

module.exports = class Handlers {
  constructor (Model) {
    this.Model = Model
  }

  async handleGet (request) {
    return this.Model.getAll(request.query)
  }

  async handleGetById (request) {
    const model = await this.Model.getById(request.params.id)
    if (model) {
      return model
    }
    return Boom.notFound()
  }

  async handlePost (request) {
    const model = new this.Model(request.payload)
    return model.save()
  }

  async handlePatch (request) {
    const model = await this.Model.getById(request.params.id)
    if (model) {
      Object.assign(model, request.payload)
      return model.save()
    }
    return Boom.notFound()
  }

  async handleDelete (request) {
    const model = await this.Model.getById(request.params.id)
    if (model) {
      return model.delete()
    }
    return Boom.notFound()
  }

  async handleError (request, h, err) {
    if (err.isJoi && Array.isArray(err.details) && err.details.length > 0) {
      const { payload } = err.output
      return Boom.badData(payload.message, payload)
    }

    return h.response(err)
      .takeover()
  }

  routes ({ path, params, schema, label }) {
    params = Joi.object(params)
    schema = Joi.object(schema).label(label)
    const handleGet = this.handleGet.bind(this)
    const handleGetById = this.handleGetById.bind(this)
    const handlePost = this.handlePost.bind(this)
    const handlePatch = this.handlePatch.bind(this)
    const handleDelete = this.handleDelete.bind(this)
    const handleError = this.handleError.bind(this)

    return [
      {
        method: 'GET',
        path,
        handler: handleGet,
        options: {
          cors,
          tags: ['api'],
          security: true,
          validate: {
            query: schema,
            failAction: handleError
          }
        }
      }, {
        method: 'GET',
        path: `${path}/{id}`,
        handler: handleGetById,
        options: {
          cors,
          tags: ['api'],
          security: true,
          validate: {
            params,
            failAction: handleError
          }
        }
      }, {
        method: 'POST',
        path,
        handler: handlePost,
        options: {
          cors,
          tags: ['api'],
          security: true,
          payload: {
            allow: ['application/json']
          },
          validate: {
            payload: schema,
            failAction: handleError
          }
        }
      }, {
        method: 'PATCH',
        path: `${path}/{id}`,
        handler: handlePatch,
        options: {
          cors,
          tags: ['api'],
          security: true,
          payload: {
            allow: ['application/json']
          },
          validate: {
            params,
            payload: schema,
            failAction: handleError
          }
        }
      }, {
        method: 'DELETE',
        path: `${path}/{id}`,
        handler: handleDelete,
        options: {
          cors,
          tags: ['api'],
          security: true,
          payload: {
            allow: ['application/json']
          },
          validate: {
            params,
            failAction: handleError
          }
        }
      }
    ]
  }
}
