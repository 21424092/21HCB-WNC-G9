const database = require("../../models");
const CustomerClass = require("../customer/customer.class");
const PROCEDURE_NAME = require("../../common/const/procedureName.const");
const apiHelper = require("../../common/helpers/api.helper");
const stringHelper = require("../../common/helpers/string.helper");
const fileHelper = require("../../common/helpers/file.helper");
const mssql = require("../../models/mssql");
const logger = require("../../common/classes/logger.class");
const API_CONST = require("../../common/const/api.const");
const ServiceResponse = require("../../common/responses/service.response");
const folderNameAvatar = "avatar";
const config = require("../../../config/config");
const cacheHelper = require("../../common/helpers/cache.helper");
const CACHE_CONST = require("../../common/const/cache.const");
const cache = require("../../common/classes/cache.class");
const _ = require("lodash");

const getAccountByNumber = async (accountNumber) => {
  try {
    let customer = await database.sequelize.query(
      `${PROCEDURE_NAME.CUS_CUSTOMER_PAYMENT_GETBYPAYMENTNUMBER} @PAYMENTNUMBER=:PAYMENTNUMBER`,
      {
        replacements: {
          PAYMENTNUMBER: accountNumber,
        },
        type: database.QueryTypes.SELECT,
      }
    );

    if (customer.length) {
      customer = CustomerClass.accountNumber(customer[0]);
      return customer;
    }

    return null;
  } catch (e) {
    logger.error(e, {
      function: "customerService.detailCustomer",
    });

    return null;
  }
};

// const createCustomer = async (bodyParams = {}) => {
//   try {
//     const customerid = await createCustomerOrUpdate(bodyParams);
//     removeCacheOptions();
//     return customerid;
//   } catch (e) {
//     logger.error(e, {
//       function: "customerService.createCustomer",
//     });

//     return null;
//   }
// };

module.exports = {
  getAccountByNumber,
};
