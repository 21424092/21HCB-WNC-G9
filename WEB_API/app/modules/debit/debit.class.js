const Transform = require('../../common/helpers/transform.helper');

const template = {
  customer_debit_id: "{{#? CUSTOMERDEBITID}}",
  account_id: "{{#? ACCOUNTID}}",
  account_number: "{{#? ACCOUNTNUMBER}}",
  account_holder: "{{#? ACCOUNTHOLDER}}",
  current_debit: "{{#? CURRENTDEBIT}}",
  content_debit: "{{#? CONTENTDEBIT}}",
  is_active: "{{#? ISACTIVE ? 1 : 0}}",
  created_user: "{{#? CREATEDUSER}}",
  created_date: "{{#? CREATEDDATE}}",
  updated_user: "{{#? UPDATEDUSER}}",
  updated_date: "{{#? UPDATEDDATE}}",
  is_deleted: "{{#? ISDELETED}}",
  deleted_user: "{{#? DELETEDUSER}}",
  deleted_date: "{{#? DELETEDDATE}}",
};

let transform = new Transform(template);

const detail = (model) => {
  return transform.transform(model, [
    "customer_debit_id",
    "account_id",
    "account_number",
    "account_holder",
    "current_debit",
    "content_debit",
    "is_active",
  ]);
};

const list = (models = []) => {
  return transform.transform(models, [
    "customer_debit_id",
    "account_id",
    "account_number",
    "account_holder",
    "current_debit",
    "content_debit",
    "is_active",
  ]);
};

module.exports = {
  detail,
  list,
};
