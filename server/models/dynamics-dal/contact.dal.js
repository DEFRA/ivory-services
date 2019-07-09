const dataStore = {}
const BaseDal = require('./dynamicsDal')

module.exports = class ContactDal extends BaseDal {
  static get dataStore () {
    return dataStore
  }
}
