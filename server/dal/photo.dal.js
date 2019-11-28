const BaseDal = require('./baseDal')

module.exports = class Photo extends BaseDal {
  static get table () {
    return {
      id: 'uuid default uuid_generate_v1() not null constraint photo_pk primary key',
      itemId: 'uuid constraint photo_item_id_fk references item',
      filename: 'varchar not null',
      confirmed: 'boolean default false',
      rank: 'integer default 0'
    }
  }
}
