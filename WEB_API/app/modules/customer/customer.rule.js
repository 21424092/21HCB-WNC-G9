const Joi = require('joi');

const validateRules = {
<<<<<<< HEAD
  createCustomer: {
    body: Object.assign({}, ruleCreateOrUpdate, ruleResetPassword, {
      user_name: Joi.required(),
    }),
  },
  updateCustomer: {
    body: ruleCreateOrUpdate,
  },
  resetPassword: {
    body: ruleResetPassword,
  },
  changePasswordCustomer: {
    body: ruleChangePasswordCustomer,
  },
=======
>>>>>>> e51d7304c1a658cc38d9bfce8fbcbb7ae8889b0c
};

module.exports = validateRules;
