const Transform = require("../../common/helpers/transform.helper");

<<<<<<< HEAD
const template = {
  customer_id: '{{#? CUSTOMERID}}',
  full_name: '{{#? FULLNAME}}',
  email: '{{#? EMAIL}}',
  phone_number: '{{#? PHONENUMBER}}',
  address: '{{#? ADDRESS}}',
  gender: '{{ GENDER ? 1 : 0 }}',
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
    'customer_id',
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
    'customer_id',
    'full_name',
    'email',
    'phone_number',
    'address',
    'gender',
    'user_name',
    'first_name',
    'last_name',
    'birthday',
    'user_groups',
  ]);
};

const list = (users = []) => {
  return transform.transform(users, [
    'customer_id',
    'user_name',
    'full_name',
    'gender',
    'phone_number',
    'address',
    'email',
  ]);
};

const generateCustomerName = (user) => {
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

module.exports = {
  basicInfo,
  detail,
  list,
  generateCustomerName,
  options,
=======
const templateAccountNumber = {
  accountNumber: "{{#? PAYMENTNUMBER}}",
  accountName: "{{#? PAYMENTNAME  }}",
};

const accountNumber = (data) => {
  let transform = new Transform(templateAccountNumber);
  return transform.transform(data, ["accountNumber", "accountName"]);
};

module.exports = {
  accountNumber,
>>>>>>> e51d7304c1a658cc38d9bfce8fbcbb7ae8889b0c
};
