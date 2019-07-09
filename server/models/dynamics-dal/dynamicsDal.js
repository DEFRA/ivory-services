const uuid = require('uuid/v1')

module.exports = class BaseDal {
  static async getToken () {

  }

  static async findAll (query) {
    const allResults = Object.values(this.dataStore)
    if (query) {
      return allResults.filter((result) => !Object.entries(query).find(([propName, val]) => result[propName] !== val))
    }
    return allResults
  }

  static async find (id) {
    return this.dataStore[id]
  }

  static async save (data) {
    if (!data.id) {
      data.id = uuid()
    }
    this.dataStore[data.id] = data
    return data
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
