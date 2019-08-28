const BaseDal = require('./baseDal')

module.exports = class Address extends BaseDal {
  static get table () {
    return {
      id: 'uuid default uuid_generate_v1() not null constraint address_pk primary key',
      addressLine1: 'varchar not null',
      addressLine2: 'varchar',
      town: 'varchar not null',
      county: 'varchar',
      postcode: 'varchar not null',
      country: 'varchar',
      uprn: 'varchar'
    }
  }
}
