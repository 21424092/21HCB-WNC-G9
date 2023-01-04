const Joi = require('joi');

const ruleCreateOrUpdate = {
  user_group_name: Joi.string().required(),
  description: Joi.string().allow('', null),
  order_index: Joi.number().required(),
  is_active: Joi.number().valid(0, 1).required(),
  user_group_functions: Joi.array().required(),
};

const validateRules = {
  createUserGroup: {
    body: ruleCreateOrUpdate,
  },
  updateUserGroup: {
    body: ruleCreateOrUpdate,
  },
  changeStatusUserGroup: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
