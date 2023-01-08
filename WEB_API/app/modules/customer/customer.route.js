const express = require('express');
const validate = require('express-validation');
const rules = require('./customer.rule');
const customerController = require('./customer.controller');

const routes = express.Router();

const prefix = '/customer';
routes.route('').get(customerController.getListCustomer);
routes.route('/list-account').get(customerController.getListAccountCustomer);
routes
  .route('')
  .post(validate(rules.createCustomer), customerController.createCustomer);
routes
  .route('/create-account')
  .post(
    validate(rules.createAccountCustomer),
    customerController.createCustomerAccount,
  );
routes
  .route('/update-paid-account')
  .post(
    validate(rules.updatePaidAccountCustomer),
    customerController.updatePaidAccount,
  );
routes
  .route('/opts-customer-account/:customerId(\\d+)')
  .get(customerController.getListCustomerAccount);

module.exports = {
  prefix,
  routes,
};
