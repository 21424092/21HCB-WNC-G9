const Transform = require("../../common/helpers/transform.helper");

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
};
