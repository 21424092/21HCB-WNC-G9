const Transform = require('../../common/helpers/transform.helper');

const template = {
  customer_debit_id: '{{#? CUSTOMERDEBITID}}',
  account_id: '{{#? ACCOUNTID}}',
  account_number: '{{#? ACCOUNTNUMBER}}',
  account_holder: '{{#? ACCOUNTHOLDER}}',
  current_debit: '{{#? CURRENTDEBIT}}',
  content_debit: '{{#? CONTENTDEBIT}}',
  status_debit: '{{#? STATUSDEBIT}}',
  is_active: '{{#? ISACTIVE ? 1 : 0}}',
  created_user: '{{#? CREATEDUSER}}',
  created_date: '{{#? CREATEDDATE}}',
  updated_user: '{{#? UPDATEDUSER}}',
  updated_date: '{{#? UPDATEDDATE}}',
  is_deleted: '{{#? ISDELETED}}',
  deleted_user: '{{#? DELETEDUSER}}',
  deleted_date: '{{#? DELETEDDATE}}',
  email: '{{#? EMAIL}}',
  show_button: '{{#? SHOWPBUTTON}}',
};

let transform = new Transform(template);

const detail = (model) => {
  return transform.transform(model, [
    'customer_debit_id',
    'account_id',
    'account_number',
    'account_holder',
    'current_debit',
    'content_debit',
    'is_active',
    'email',
  ]);
};
const detailAccountNumber = (model) => {
  return transform.transform(model, [
    'account_id',
    'account_number',
    'account_holder',
  ]);
};
const templateMail = {
  mail_type: '{{#? MAILTYPE}}',
  mail_content: '{{#? MAILCONTENT}}',
};
let transformMail = new Transform(templateMail);
const mail = (model) => {
  return transformMail.transform(model, ['mail_type', 'mail_content']);
};

const list = (models = []) => {
  return transform.transform(models, [
    'customer_debit_id',
    'account_id',
    'account_number',
    'account_holder',
    'current_debit',
    'content_debit',
    'status_debit',
    'is_active',
    'show_button',
  ]);
};

module.exports = {
  detail,
  list,
  detailAccountNumber,
  mail,
};
