const expressApp = require("express")();
const swaggerJsdoc = require("swagger-jsdoc"),
  swaggerUi = require("swagger-ui-express");
const init = require("./app/app");
const app = init(expressApp);

exports.app = app;
