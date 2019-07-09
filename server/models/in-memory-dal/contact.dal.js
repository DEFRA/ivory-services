const dataStore = {}
const BaseDal = require('./inMemoryDal')

module.exports = class ContactDal extends BaseDal {
  static get dataStore () {
    return dataStore
  }
}
