const config = require('../config')
const Pool = config.postgresEnabled ? require('pg').Pool : require('./inMemoryPg').Pool
const { logger } = require('defra-logging-facade')

function isEmpty (obj) {
  return !obj || Object.getOwnPropertyNames(obj).length === 0
}

module.exports = class BaseDal {
  static get pool () {
    if (!this._pool) {
      this._pool = new Pool({
        user: config.postgresUser,
        host: config.postgresHost,
        database: config.postgresDatabase,
        password: config.postgresPassword,
        port: config.postgresPort
      })
    }
    return this._pool
  }

  static dalToModel (data) {
    if (Array.isArray(data)) {
      return data.map((row) => this.dalToModel(row))
    }
    const props = Object.keys(this.table)
    const cols = props.map((prop) => prop.toLowerCase())
    const model = {}
    Object.entries(data).forEach(([col, val]) => {
      if (val !== null) {
        const pos = cols.indexOf(col)
        model[props[pos]] = val
      }
    })
    return model
  }

  static async findAll (query) {
    const where = !isEmpty(query) ? 'WHERE ' + Object.entries(query)
      .map(([col, val]) => {
        return `${col.toLowerCase()} = ${this.table[col].includes('varchar') ? `'${val}'` : val}`
      })
      .join(' AND ') : ''
    const queryText = `SELECT * FROM "${this.tableName}" ${where}`
    logger.debug(queryText)
    const { rows } = await this.pool.query(queryText)
      .catch((errors) => {
        logger.error(errors)
        return errors
      })
    return this.dalToModel(rows)
  }

  static async find (id) {
    const queryText = `SELECT * FROM "${this.tableName}" WHERE id = '${id}'`
    logger.debug(queryText)
    const { rows } = await this.pool.query(queryText)
      .catch((errors) => {
        logger.error(errors)
        return errors
      })
    return this.dalToModel(rows.pop())
  }

  static async save (data) {
    if (data.id) {
      const setArray = Object.entries(data).map(([col, val]) => {
        return `${col.toLowerCase()} = '${val}'`
      }).join(', ')
      const queryText = `UPDATE "${this.tableName}" SET ${setArray} WHERE id = '${data.id}'`
      logger.debug(queryText)
      const result = await this.pool.query(queryText)
        .catch((errors) => {
          logger.error(errors)
          return errors
        })
      if (result) {
        return this.find(data.id)
      }
    } else {
      const columns = []
      const values = []
      const dataArray = []
      let index = 1
      Object.entries(data)
        .filter(([col]) => col !== 'id')
        .forEach(([col, val]) => {
          if (val !== undefined) {
            columns.push(col.toLowerCase())
            values.push('$' + (index++))
            dataArray.push(val)
          }
        })
      const queryText = `INSERT INTO "${this.tableName}" (${columns.join(
        ', ')}) VALUES (${values.join(', ')}) RETURNING *;`
      logger.debug(queryText, dataArray)
      const result = await this.pool.query(queryText, dataArray)
        .catch((errors) => {
          logger.error(errors)
          return errors
        })
      return this.dalToModel(result.rows.pop())
    }
  }

  static async delete (id) {
    const queryText = `DELETE FROM "${this.tableName}" WHERE id = '${id}'`
    logger.debug(queryText)
    const result = await this.pool.query(queryText)
      .catch((errors) => {
        logger.error(errors)
        return errors
      })
    return result
  }

  static get tableName () {
    return this.name.toLowerCase()
  }

  static async createTable () {
    const queryText = `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE TABLE IF NOT EXISTS "${this.tableName}" (
        ${Object.entries(this.table).map(([column, definition]) => `${column.toLowerCase()} ${definition}`).join(',\n\t')}
       );
      ALTER TABLE "${this.tableName}" OWNER TO ${config.postgresUser};
    `
    logger.debug(queryText)
    const result = this.pool.query(queryText)
      .catch((errors) => {
        logger.error(errors)
      })
    return result
  }
}
