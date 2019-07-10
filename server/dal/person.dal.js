const dataStore = {}
const BaseDal = require('./baseDal')

module.exports = class PersonDal extends BaseDal {
  static get dataStore () {
    return dataStore
  }
}
