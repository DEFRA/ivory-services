const BaseDal = require('./baseDal')

module.exports = class Registration extends BaseDal {
  static get table () {
    return {
      id: 'uuid default uuid_generate_v1() not null constraint registration_pk primary key',
      ownerId: 'uuid constraint registration_person_id_fk references person',
      agentId: 'uuid constraint registration_person_id_fk_2 references person',
      itemId: 'uuid constraint registration_item_id_fk references item',
      paymentId: 'uuid constraint registration_payment_id_fk references payment',
      registrationNumber: 'varchar',
      agentActingAs: 'varchar',
      confirmationSent: 'boolean',
      ownerType: 'varchar',
      dealingIntent: 'varchar',
      status: 'varchar',
      submittedDate: 'timestamptz'
    }
  }
}
