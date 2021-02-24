const Boom = require('@hapi/boom')
const Joi = require('joi')
const { Group, Choice } = require('../models')

const config = require('../config')
const cors = (config.isDev || config.isTest)

class Handlers {
  async getChoices (groupId) {
    const choices = await Choice.getAll({ groupId })
    return choices
      .sort(({ rank: firstRank }, { rank: secondRank }) => firstRank > secondRank)
      .map((choice) => Object.assign(choice, { value: choice.value !== undefined ? choice.value : choice.shortName }))
  }

  async handleGet (request) {
    const groups = await Group.getAll(request.query)
    const referenceData = {}
    await Promise.all(groups.map(async (group) => {
      const { id: groupId } = group
      group.choices = await this.getChoices(groupId)
      referenceData[group.type] = group
    }))
    return referenceData
  }

  async handleGetById (request) {
    const group = await Group.getById(request.params.id)
    const { id: groupId } = group
    group.choices = await this.getChoices(groupId)
    return group
  }

  async handleError (request, h, err) {
    if (err.isJoi && Array.isArray(err.details) && err.details.length > 0) {
      const { payload } = err.output
      return Boom.badData(payload.message, payload)
    }

    return h.response(err).takeover()
  }

  routes ({ path, params, schema }) {
    let query = {}
    Object.entries(schema).forEach(([prop, val]) => {
      if (val._type !== 'object') {
        query[prop] = val
      }
    })
    query = Joi.object(query)
    params = Joi.object(params)
    const handleGet = this.handleGet.bind(this)
    const handleGetById = this.handleGetById.bind(this)
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
            query,
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
      }
    ]
  }
}

const handlers = new Handlers()

module.exports = handlers.routes({
  path: '/reference-data',
  params: Group.params,
  schema: Group.schema
})
