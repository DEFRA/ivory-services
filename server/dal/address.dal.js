const BaseDal = require('./baseDal')

module.exports = class Address extends BaseDal {
  static get table () {
    return {
      id: 'uuid default uuid_generate_v1() not null constraint address_pk primary key',
      businessName: 'varchar',
      addressLine1: 'varchar',
      addressLine2: 'varchar',
      town: 'varchar',
      county: 'varchar',
      postcode: 'varchar',
      country: 'varchar',
      uprn: 'varchar'
    }
  }
}
