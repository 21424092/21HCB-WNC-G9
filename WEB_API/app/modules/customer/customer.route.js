const express = require("express");
const validate = require("express-validation");
const rules = require("./customer.rule");
const customerController = require("./customer.controller");

const routes = express.Router();

const prefix = "/customer";

// List customer
routes.route("").get(customerController.getListCustomer);

// Create new a customer
routes
  .route("")
  .post(validate(rules.createCustomer), customerController.createCustomer);


// List options function
routes.route("/get-options").get(customerController.getOptions);

// Reset password a customer -- admin
routes
  .route("/:customerId/change-password")
  .put(validate(rules.resetPassword), customerController.resetPassword);
// Change password a customer
routes
  .route("/:customerId/change-password-customer")
  .put(
    validate(rules.changePasswordCustomer),
    customerController.changePasswordCustomer
  );
// Update a customer
routes
  .route("/:customerId")
  .put(validate(rules.updateCustomer), customerController.updateCustomer);

// Delete a customer
routes.route("/:customerId").delete(customerController.deleteCustomer);

// Detail a customer
routes.route("/:customerId").get(customerController.detailCustomer);

module.exports = {
  prefix,
  routes,
};
