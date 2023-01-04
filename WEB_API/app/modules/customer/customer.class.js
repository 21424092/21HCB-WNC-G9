const Transform = require("../../common/helpers/transform.helper");

const template = {
  customer_id: "{{#? CUSTOMERID}}",
  customer_name: "{{#? CUSTOMERNAME}}",
  first_name: "{{#? FIRSTNAME}}",
  last_name: "{{#? LASTNAME}}",
  full_name: "{{#? FULLNAME}}",
  email: "{{#? EMAIL}}",
  phone_number: "{{#? PHONENUMBER}}",
  address: "{{#? ADDRESS}}",
  gender: "{{ GENDER ? 1 : 0 }}",
  password: "{{#? PASSWORD}}",
  birthday: "{{#? BIRTHDAY }}",
  updated_customer: "{{#? UPDATEDCUSTOMER}}",
  created_customer: "{{#? CREATEDCUSTOMER}}",
 default_picture_url: "{{#? DEFAULTPICTUREURL}}",
};

let transform = new Transform(template);

const basicInfo = (customer) => {
  return transform.transform(customer, [
    "customer_id",
    "customer_name",
    "password",
    "full_name",
    "email",
    "phone_number",
  ]);
};

const detail = (customer) => {
  return transform.transform(customer, [
    "customer_id",
    "customer_name",
    "first_name",
    "last_name",
    "full_name",
    "email",
    "phone_number",
    "address",
    "gender",
    "birthday",
    "default_picture_url",
  ]);
};

const list = (customers = []) => {
  return transform.transform(customers, [
    "customer_id",
    "customer_name",
    "full_name",
    "phone_number",
    "address",
    "email",
  ]);
};

// options
const templateOptions = {
  id: "{{#? ID}}",
  name: "{{#? NAME}}",
};

const options = (customerGroups = []) => {
  let transform = new Transform(templateOptions);
  return transform.transform(customerGroups, ["id", "name"]);
};
module.exports = {
  basicInfo,
  detail,
  list,
  options,
};
