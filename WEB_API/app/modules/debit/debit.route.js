const express = require('express');
const validate = require('express-validation');
const rules = require('./debit.rule');
const debitController = require('./debit.controller');
const routes = express.Router();
const prefix = '/debit';

// List debit
routes.route('')
  .get(debitController.getListAdebit);

// Create new a debit
routes.route('')
  .post(validate(rules.createAdebit), debitController.createAdebit);

// Update a debit
routes.route('/:debitId(\\d+)')
  .put(validate(rules.updateAdebit), debitController.updateAdebit);

// Delete a debit
routes.route('/:debitId(\\d+)')
  .delete(debitController.deleteAdebit);

// Detail a debit
routes.route('/:debitId(\\d+)')
  .get(debitController.detailAdebit);

// Change status a debit
routes.route('/:debitId/change-status')
  .put(validate(rules.changeStatusAdebit), debitController.changeStatusAdebit);

module.exports = {
  prefix,
  routes,
};
