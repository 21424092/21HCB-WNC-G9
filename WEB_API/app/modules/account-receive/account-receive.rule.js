const Joi = require('joi');

const ruleCreateOrUpdate = {
  account_holder: Joi.string().required(),
  account_number: Joi.string().required(),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createAccountReceive: {
    body: ruleCreateOrUpdate,
  },
  updateAccountReceive: {
    body: ruleCreateOrUpdate,
  },
  changeStatusAccountReceive: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
