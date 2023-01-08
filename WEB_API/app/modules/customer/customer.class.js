const Transform = require("../../common/helpers/transform.helper");

const template = {
  customer_id: "{{#? CUSTOMERID}}",
  full_name: "{{#? FULLNAME}}",
  email: "{{#? EMAIL}}",
  phone_number: "{{#? PHONENUMBER}}",
  address: "{{#? ADDRESS}}",
  gender: "{{ GENDER ? 1 : 0 }}",
  user_name: "{{#? USERNAME}}",
  password: "{{#? PASSWORD}}",
  first_name: "{{#? FIRSTNAME}}",
  last_name: "{{#? LASTNAME}}",
  birthday: "{{#? BIRTHDAY }}",
  updated_user: "{{#? UPDATEDUSER}}",
  created_user: "{{#? CREATEDUSER}}",
  account_number: "{{#? ACCOUNTNUMBER}}",
  account_holder: "{{#? ACCOUNTHOLDER}}",
  type: "customer_linking",
  current_balance: "{{#? CURRENTBALANCE}}",
};

let transform = new Transform(template);

const basicInfo = (user) => {
  return transform.transform(user, [
    "customer_id",
    "user_name",
    "password",
    "full_name",
    "email",
    "phone_number",
    "type",
  ]);
};

const detail = (customer) => {
  return transform.transform(customer, [
    "customer_id",
    "full_name",
    "email",
    "phone_number",
    "address",
    "gender",
    "user_name",
    "first_name",
    "last_name",
    "birthday",
  ]);
};

const listTaiKhoan = (customers = []) => {
  return transform.transform(customers, [
    "customer_id",
    "account_holder",
    "account_number",
    "current_balance",
  ]);
};

const list = (customers = []) => {
  return transform.transform(customers, [
    "customer_id",
    "user_name",
    "full_name",
    "gender",
    "phone_number",
    "address",
    "email",
    "account_holder",
    "account_number",
  ]);
};

const generateCustomerName = (customer) => {
  return transform.transform(customer, ["user_name"]);
};
// options
const templateOptions = {
  id: "{{#? ID}}",
  name: "{{#? NAME}}",
};

const options = (customers = []) => {
  let transform = new Transform(templateOptions);
  return transform.transform(customers, ["id", "name"]);
};

module.exports = {
  basicInfo,
  detail,
  list,
  generateCustomerName,
  options,
  listTaiKhoan,
};
