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
