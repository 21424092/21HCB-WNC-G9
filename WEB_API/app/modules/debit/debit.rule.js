const Joi = require('joi');

const ruleCreateOrUpdate = {
  account_holder: Joi.string().required(),
  account_number: Joi.string().required(),
  current_debit: Joi.number().required(),
  content_debit: Joi.string().required(),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createDebit: {
    body: ruleCreateOrUpdate,
  },
  cancelDebit: {
    body: {
      content: Joi.string().required(),
      customer_debit_id: Joi.number().required(),
    },
  },
  doneDebit: {
    body: {
      otp: Joi.string().required(),
      customer_debit_id: Joi.number().required(),
    },
  },
  updateDebit: {
    body: ruleCreateOrUpdate,
  },
  changeStatusDebit: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
