const express = require('express');
const validate = require('express-validation');
const rules = require('./auth.rule');
const authController = require('./auth.controller');

const routes = express.Router();

const prefix = '/auth';

routes
  .route('/token')
  .post(validate(rules.createToken), authController.createToken);

routes
  .route('/refresh-token')
  .post(validate(rules.refreshToken), authController.refreshToken);

routes.route('/get-profile').get(authController.getProfile);

routes.route('/logout').post(authController.logout);

routes.route('/bank-access-token').post(authController.bankAccessToken);

routes.route('/bank-refresh-token').post(authController.bankRefreshToken);

// routes.route("/customer-access-token").post(authController.bankAccessToken);

// routes.route("/customer-refresh-token").post(authController.bankRefreshToken);

module.exports = {
  prefix,
  routes,
};
