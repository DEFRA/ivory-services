const BaseDal = require('./baseDal')

module.exports = class Item extends BaseDal {
  static get table () {
    return {
      id: 'uuid default uuid_generate_v1() not null constraint item_pk primary key',
      description: 'varchar'
    }
  }
}
