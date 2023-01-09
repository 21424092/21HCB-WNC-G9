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
// Detail a debit
routes
  .route("/get-account/:accountNumber")
  .get(debitController.detailAccountDebit);

// Change status a debit
routes.route('/:debitId/change-status')
  .put(validate(rules.changeStatusDebit), debitController.changeStatusDebit);
// Create new a debit
routes
  .route("/cancel-debit")
  .post(validate(rules.cancelDebit), debitController.cancelDebit);
  // Create new a debit
routes
  .route("/done-debit")
  .post(validate(rules.doneDebit), debitController.doneDebit);
// Detail a debit
routes
  .route("/send-otp/:customerDebitId")
  .get(debitController.sendMailOTP);
module.exports = {
  prefix,
  routes,
};
