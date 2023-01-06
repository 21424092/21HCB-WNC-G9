const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
  user_id: '{{#? USERID}}',
  full_name: '{{#? FULLNAME}}',
  email: '{{#? EMAIL}}',
  phone_number: '{{#? PHONENUMBER}}',
  address: '{{#? ADDRESS}}',
  gender: '{{ GENDER ? 1 : 0 }}',
  default_picture_url: `${config.domain_cdn}{{DEFAULTPICTUREURL}}`,
  user_name: '{{#? USERNAME}}',
  password: '{{#? PASSWORD}}',
  first_name: '{{#? FIRSTNAME}}',
  last_name: '{{#? LASTNAME}}',
  birthday: '{{#? BIRTHDAY }}',
  user_groups: '{{#? USERGROUPS.split("|")}}',
  updated_user: '{{#? UPDATEDUSER}}',
  created_user: '{{#? CREATEDUSER}}',
  type: 'admin_linking',
};

let transform = new Transform(template);

const basicInfo = (user) => {
  return transform.transform(user, [
    'user_id',
    'user_name',
    'password',
    'full_name',
    'email',
    'phone_number',
    'type',
  ]);
};

const detail = (user) => {
  return transform.transform(user, [
    'user_id',
    'full_name',
    'email',
    'phone_number',
    'address',
    'gender',
    'default_picture_url',
    'user_name',
    'first_name',
    'last_name',
    'birthday',
    'description',
    'user_groups',
  ]);
};

const list = (users = []) => {
  return transform.transform(users, [
    'user_id',
    'user_name',
    'full_name',
    'gender',
    'phone_number',
    'address',
    'email',
  ]);
};

const generateUsername = (user) => {
  return transform.transform(user, ['user_name']);
};
// options
const templateOptions = {
  id: '{{#? ID}}',
  name: '{{#? NAME}}',
};

const options = (userGroups = []) => {
  let transform = new Transform(templateOptions);
  return transform.transform(userGroups, ['id', 'name']);
};

// options
const templateBank = {
  id: '{{#? BANKLINKINGID}}',
  name: '{{#? BANKLINKINGNAME}}',
  secret: '{{#? BANKLINKINGSECRET}}',
  status: '{{#? BANKLINKINGSTATUS}}',
  type: 'bank_linking',
};

const bankInfo = (data) => {
  let transform = new Transform(templateBank);
  return transform.transform(data, ['id', 'name', 'secret', 'status', 'type']);
};

module.exports = {
  basicInfo,
  detail,
  list,
  generateUsername,
  options,
  bankInfo,
};
