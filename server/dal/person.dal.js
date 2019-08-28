const BaseDal = require('./baseDal')

module.exports = class Person extends BaseDal {
  static get table () {
    return {
      id: 'uuid default uuid_generate_v1() not null constraint person_pk primary key',
      fullName: 'varchar not null',
      email: 'varchar not null',
      addressId: `uuid constraint person_address_id_fk references address`
    }
  }
}
