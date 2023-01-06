const express = require('express');
const validate = require('express-validation');
const rules = require('./customer.rule');
const customerController = require('./customer.controller');

const routes = express.Router();

const prefix = '/customer';

routes
  .route('/account')
  .get(customerController.getAccountByNumber);


module.exports = {
  prefix,
  routes,
};
