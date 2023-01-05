const Transform = require('../../common/helpers/transform.helper');

const template = {
  menu_id: '{{#? MENUID}}',
  function_id: '{{#? FUNCTIONID}}',
  function_name: '{{#? FUNCTIONNAME}}',
  menu_name: '{{#? MENUNAME}}',
  link_menu: '{{#? LINKMENU}}',
  description: '{{#? DESCRIPTION}}',
  icon_path: '{{#? ICONPATH}}',
  parent_id: '{{#? PARENTID}}',
  order_index: '{{#? ORDERINDEX}}',
  is_active: '{{ISACTIVE ? 1 : 0}}',
  is_customer: '{{ISCUSTOMER ? 1 : 0}}',
  created_user: '{{#? CREATEDUSER}}',
  created_date: '{{#? CREATEDDATE}}',
  updated_user: '{{#? UPDATEDUSER}}',
  updated_date: '{{#? UPDATEDDATE}}',
  is_deleted: '{{#? ISDELETED}}',
  deleted_user: '{{#? DELETEDUSER}}',
  deleted_date: '{{#? DELETEDDATE}}',
};

let transform = new Transform(template);

const detail = (menu) => {
  return transform.transform(menu, [
    'menu_id',
    'function_id',
    'menu_name',
    'link_menu',
    'description',
    'icon_path',
    'parent_id',
    'order_index',
    'is_active',
    'is_customer',
  ]);
};

const list = (users = []) => {
  return transform.transform(users, [
    'menu_id',
    'menu_name',
    'link_menu',
    'icon_path',
    'parent_id',
    'is_active',
    'order_index',
    'description',
    'function_name',
  ]);
};

module.exports = {
  detail,
  list,
};
