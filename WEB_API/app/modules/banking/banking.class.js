<<<<<<< HEAD
const Transform = require('../../common/helpers/transform.helper');

const templateAccountNumber = {
  accountNumber: '{{#? PAYMENTNUMBER}}',
  accountName: '{{#? PAYMENTNAME  }}',
};

const accountNumber = (data) => {
  let transform = new Transform(templateAccountNumber);
  return transform.transform(data, ['accountNumber', 'accountName']);
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
  bankInfo,
  accountNumber,
};
=======
const Transform = require('../../common/helpers/transform.helper');

const template = {
  from_account_number: '{{#? FROMACCOUNTNUMBER}}',
  from_account_name: '{{#? FROMACCOUNTNAME}}',
  to_account_number: '{{#? TOACCOUNTNUMBER}}',
  to_account_name: '{{#? TOACCOUNTNAME}}',
  amount: '{{#? AMOUNT}}',
  charge_code: '{{#? CHARGECODE}}',
  charge_amount: '{{#? CHARGEAMOUNT}}',
  content: '{{#? CONTENT}}',
  bankid: '{{#? BANKID}}',
  signature: '{{#? SIGNATURE}}',
};

let transform = new Transform(template);

module.exports = {};
>>>>>>> e51d7304c1a658cc38d9bfce8fbcbb7ae8889b0c
