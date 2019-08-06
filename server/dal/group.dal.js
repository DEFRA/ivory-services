const BaseDal = require('./baseDal')

module.exports = class Group extends BaseDal {
  static get table () {
    return {
      id: 'uuid default uuid_generate_v1() not null constraint group_pk primary key',
      type: 'varchar not null',
      title: 'varchar',
      description: 'varchar',
      hint: 'varchar',
      multiple: 'boolean default false'
    }
  }
}
