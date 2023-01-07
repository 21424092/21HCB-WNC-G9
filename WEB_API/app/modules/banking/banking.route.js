<<<<<<< HEAD
const express = require('express');
const validate = require('express-validation');
const rules = require('./banking.rule');
const bankingController = require('./banking.controller');

const routes = express.Router();

const prefix = '/banking';
routes
  .route('/tranfer')
  .post(validate(rules.tranfer), bankingController.createTransaction);
module.exports = {
  prefix,
  routes,
};
=======
const express = require('express');
const validate = require('express-validation');
const rules = require('./banking.rule');
const bankingController = require('./banking.controller');

const routes = express.Router();

const prefix = '/banking';
routes
  .route("/tranfer")
  .post(validate(rules.tranfer), bankingController.createTransaction);
module.exports = {
  prefix,
  routes,
};
>>>>>>> e51d7304c1a658cc38d9bfce8fbcbb7ae8889b0c
