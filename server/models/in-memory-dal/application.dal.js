const dataStore = {}
const BaseDal = require('./inMemoryDal')

module.exports = class ApplicationDal extends BaseDal {
  static get dataStore () {
    return dataStore
  }
}
