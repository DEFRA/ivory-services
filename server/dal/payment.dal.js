const BaseDal = require('./baseDal')

module.exports = class Payment extends BaseDal {
  static get table () {
    return {
      id: 'uuid default uuid_generate_v1() not null constraint payment_pk primary key',
      paymentId: 'varchar',
      paymentProvider: 'varchar',
      description: 'varchar',
      reference: 'varchar',
      status: 'varchar',
      amount: 'integer',
      createdDate: 'timestamptz'
    }
  }
}
