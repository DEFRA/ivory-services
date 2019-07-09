
const Boom = require('@hapi/boom')

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

  routes ({ path, params, schema }) {
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
          tags: ['api'],
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
          tags: ['api'],
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
          tags: ['api'],
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
          tags: ['api'],
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
          tags: ['api'],
          validate: {
            params,
            failAction: handleError
          }
        }
      }
    ]
  }
}
