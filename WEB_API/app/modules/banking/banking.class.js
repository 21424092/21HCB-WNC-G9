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
