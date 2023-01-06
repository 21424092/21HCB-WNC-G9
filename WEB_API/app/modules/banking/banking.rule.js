const Joi = require("joi");

const ruleTranfer = {
  from_account_number: Joi.string().required(),
  from_account_name: Joi.string().required(),
  to_account_number: Joi.string().required(),
  to_account_name: Joi.string().required(),
  amount: Joi.number().required(),
  charge_code: Joi.string().required(),
  charge_amount: Joi.number().required(),
  content: Joi.string().required(),
  bankid: Joi.string().required(),
  signature: Joi.string().required(),
};
const validateRules = {
  tranfer: {
    body: ruleTranfer,
  },
};

module.exports = validateRules;
