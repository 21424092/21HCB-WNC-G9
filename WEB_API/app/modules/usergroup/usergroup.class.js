const Transform = require('../../common/helpers/transform.helper');

const template = {
  user_group_id: '{{#? USERGROUPID}}',
  user_group_name: '{{#? USERGROUPNAME}}',
  description: '{{#? DESCRIPTION}}',
  order_index: '{{#? ORDERINDEX}}',
  is_active: '{{ISACTIVE ? 1 : 0}}',
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
    'user_group_id',
    'user_group_name',
    'description',
    'order_index',
    'is_active',
  ]);
};

const list = (users = []) => {
  return transform.transform(users, [
    'user_group_id',
    'user_group_name',
    'description',
    'order_index',
    'is_active',
  ]);
};

module.exports = {
  detail,
  list,
};
