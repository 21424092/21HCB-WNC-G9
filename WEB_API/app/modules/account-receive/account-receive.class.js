const Transform = require('../../common/helpers/transform.helper');

const template = {
  customer_account_receive_id: '{{#? CUSTOMERACCOUNTRECEIVEID}}',
  account_number: '{{#? ACCOUNTNUMBER}}',
  account_holder: '{{#? ACCOUNTHOLDER}}',
  nickname: '{{#? NICKNAME}}',
  bank_id: '{{#? BANKID}}',
  bank_name: '{{#? BANKNAME}}',
  is_active: '{{#? ISACTIVE ? 1 : 0}}',
  created_user: '{{#? CREATEDUSER}}',
  created_date: '{{#? CREATEDDATE}}',
  updated_user: '{{#? UPDATEDUSER}}',
  updated_date: '{{#? UPDATEDDATE}}',
  is_deleted: '{{#? ISDELETED}}',
  deleted_user: '{{#? DELETEDUSER}}',
  deleted_date: '{{#? DELETEDDATE}}',
};

let transform = new Transform(template);

const detail = (user) => {
  return transform.transform(user, [
    'customer_account_receive_id',
    'account_number',
    'account_holder',
    'nickname',
    'bank_id',
    'bank_name',
    'is_active',
  ]);
};

const list = (users = []) => {
  return transform.transform(users, [
    'customer_account_receive_id',
    'account_number',
    'account_holder',
    'nickname',
    'bank_id',
    'bank_name',
    'is_active',
  ]);
};

module.exports = {
  detail,
  list,
};
