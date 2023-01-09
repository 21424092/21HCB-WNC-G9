const express = require('express');
const validate = require('express-validation');
const rules = require('./debit.rule');
const debitController = require('./debit.controller');
const routes = express.Router();
const prefix = '/debit';

// List debit
routes.route('')
  .get(debitController.getListDebit);

// Create new a debit
routes.route('')
  .post(validate(rules.createDebit), debitController.createDebit);

// Update a debit
routes.route('/:debitId(\\d+)')
  .put(validate(rules.updateDebit), debitController.updateDebit);

// Delete a debit
routes.route('/:debitId(\\d+)')
  .delete(debitController.deleteDebit);

// Detail a debit
routes.route('/:debitId(\\d+)')
  .get(debitController.detailDebit);

// Change status a debit
routes.route('/:debitId/change-status')
  .put(validate(rules.changeStatusDebit), debitController.changeStatusDebit);

module.exports = {
  prefix,
  routes,
};
