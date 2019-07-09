const dataStore = {}
const BaseDal = require('./dynamicsDal')

module.exports = class ApplicationDal extends BaseDal {
  static get dataStore () {
    return dataStore
  }
}
