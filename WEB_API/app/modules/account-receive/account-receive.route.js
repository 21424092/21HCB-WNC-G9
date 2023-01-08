const express = require('express');
const validate = require('express-validation');
const rules = require('./account-receive.rule');
const accountReceiveController = require('./account-receive.controller');
const routes = express.Router();
const prefix = '/account-receive';

// List accountReceive
routes.route('')
  .get(accountReceiveController.getListAccountReceive);

// Create new a accountReceive
routes.route('')
  .post(validate(rules.createAccountReceive), accountReceiveController.createAccountReceive);

// Update a accountReceive
routes.route('/:accountReceiveId(\\d+)')
  .put(validate(rules.updateAccountReceive), accountReceiveController.updateAccountReceive);

// Delete a accountReceive
routes.route('/:accountReceiveId(\\d+)')
  .delete(accountReceiveController.deleteAccountReceive);

// Detail a accountReceive
routes.route('/:accountReceiveId(\\d+)')
  .get(accountReceiveController.detailAccountReceive);

// List options
routes.route('/get-options')
  .get(accountReceiveController.getOptions);

// List options
routes.route('/get-list-bank')
  .get(accountReceiveController.getListBank);

// Change status a accountReceive
routes.route('/:accountReceiveId/change-status')
  .put(validate(rules.changeStatusAccountReceive), accountReceiveController.changeStatusAccountReceive);

module.exports = {
  prefix,
  routes,
};
