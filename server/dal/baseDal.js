const cloneDeep = require('lodash.clonedeep')
const { utils } = require('ivory-shared')

module.exports = class BaseDal {
  static async findAll (query) {
    const allResults = Object.values(this.dataStore).map((result) => cloneDeep(result))
    if (query) {
      return allResults.filter((result) => !Object.entries(query).find(([propName, val]) => result[propName] !== val))
    }
    return allResults
  }

  static async find (id) {
    return cloneDeep(this.dataStore[id])
  }

  static async save (data) {
    if (!data.id) {
      data.id = utils.uuid()
    }
    this.dataStore[data.id] = cloneDeep(data)
    return cloneDeep(data)
  }

  static async delete (id) {
    const data = this.dataStore[id]
    if (data) {
      delete this.dataStore[id]
      return true
    } else {
      return false
    }
  }
}
