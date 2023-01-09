const DebitClass = require("../debit/debit.class");
const database = require("../../models");
const PROCEDURE_NAME = require("../../common/const/procedureName.const");
const apiHelper = require("../../common/helpers/api.helper");
const mssql = require("../../models/mssql");
const sql = require("mssql");
const ServiceResponse = require("../../common/responses/service.response");
const RESPONSE_MSG = require("../../common/const/responseMsg.const");
const logger = require("../../common/classes/logger.class");
const cacheHelper = require("../../common/helpers/cache.helper");
const CACHE_CONST = require("../../common/const/cache.const");
const API_CONST = require("../../common/const/api.const");

/**
 * Get list SYS_USERGROUP
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListDebit = async (params = {}) => {
  try {
    const defaultParams = {
      keyword: null,
      itemsPerPage: API_CONST.PAGINATION.LIMIT,
      page: API_CONST.PAGINATION.DEFAULT,
      created_date_from: "",
      created_date_to: "",
    };
    const parameters = Object.assign({}, defaultParams, params);
    //
    const dataList = await database.sequelize.query(
      `${PROCEDURE_NAME.CUS_CUSTOMER_DEBIT_GETLIST} 
      @KEYWORD = :keyword,
      @PAGESIZE = :itemsPerPage,
      @PAGEINDEX = :page,
      @CREATEDDATEFROM = :created_date_from,
      @CREATEDDATETO = :created_date_to,
      @CUSTOMERID = :customer_id`,
      {
        replacements: parameters,
        type: database.QueryTypes.SELECT,
      }
    );
    //
    return {
      list: DebitClass.list(dataList),
      total: dataList[0]?.TOTALITEMS || 0,
    };
  } catch (error) {
    console.error("functionGroupService.getList", error);
    return [];
  }
};

/**
 * Create SYS_USERGROUP
 *
 * @param bodyParams
 * @returns ServiceResponse
 */
const createDebit = async (bodyParams = {}) => {
  return await createUserOrUpdate(bodyParams);
};

const updateDebit = async (bodyParams = {}) => {
  return await createUserOrUpdate(bodyParams);
};

const createUserOrUpdate = async (bodyParams = {}) => {
  const pool = await mssql.pool;

  const transaction = await new sql.Transaction(pool);

  try {
    // Begin transaction
    await transaction.begin();

    const requestDebit = new sql.Request(transaction);
    const resultDebit = await requestDebit
      .input(
        "CUSTOMERDEBITID",
        apiHelper.getValueFromObject(bodyParams, "customer_debit_id")
      )
      .input(
        "ACCOUNTID",
        apiHelper.getValueFromObject(bodyParams, "account_id")
      )
      .input(
        "ACCOUNTNUMBER",
        apiHelper.getValueFromObject(bodyParams, "account_number")
      )
      .input(
        "ACCOUNTHOLDER",
        apiHelper.getValueFromObject(bodyParams, "account_holder")
      )
      .input(
        "CURRENTDEBIT",
        apiHelper.getValueFromObject(bodyParams, "current_debit")
      )
      .input(
        "CONTENTDEBIT",
        apiHelper.getValueFromObject(bodyParams, "content_debit")
      )
      .input("CREATEDUSER", apiHelper.getValueFromObject(bodyParams, "auth_id"))
      .execute(PROCEDURE_NAME.CUS_CUSTOMER_DEBIT_CREATEORUPDATE);
    // Get USERGROUPID
    const debitId = resultDebit.recordset[0].RESULT;

    // Commit transaction
    await transaction.commit();

    removeCacheOptions();

    // Return ok
    return new ServiceResponse(true, "", debitId);
  } catch (e) {
    logger.error(e, { function: "debitService.createUserOrUpdate" });

    // Rollback transaction
    await transaction.rollback();

    // return new ServiceResponse(false, e.message); // Return error without error information
    return new ServiceResponse(false, e); // Return error with error information
    // return new ServiceResponse(false, 'Process failed', null, e); // Return error with customize message
    // throw e; // Return error default
  }
};

const detailDebit = async (debitId) => {
  try {
    const pool = await mssql.pool;

    const data = await pool
      .request()
      .input("CUSTOMERDEBITID", debitId)
      .execute(PROCEDURE_NAME.CUS_CUSTOMER_DEBIT_DETAIL);
    let debit = DebitClass.detail(data.recordset[0]);

    // If exists SYS_USERGROUP
    if (debit) {
      return new ServiceResponse(true, "", debit);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, { function: "debitService.detailDebit" });

    return new ServiceResponse(false, e.message);
  }
};

const deleteDebit = async (debitId, req) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);

  try {
    // Begin transaction
    await transaction.begin();

    // Delete user group
    const requestDebit = new sql.Request(transaction);
    await requestDebit
      .input("CUSTOMERDEBITID", debitId)
      .input("UPDATEDUSER", apiHelper.getAuthId(req))
      .execute(PROCEDURE_NAME.CUS_CUSTOMER_DEBIT_DELETE);

    // Commit transaction
    await transaction.commit();

    removeCacheOptions();

    // Return ok
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, { function: "debitService.deleteDebit" });

    // Rollback transaction
    await transaction.rollback();

    // Return failed
    return new ServiceResponse(false, e.message);
  }
};

const changeStatusDebit = async (debitId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool
      .request()
      .input("CUSTOMERDEBITID", debitId)
      .input("ISACTIVE", apiHelper.getValueFromObject(bodyParams, "is_active"))
      .input("UPDATEDUSER", apiHelper.getValueFromObject(bodyParams, "auth_id"))
      .execute(PROCEDURE_NAME.CUS_CUSTOMER_DEBIT_CHANGESTATUS);

    removeCacheOptions();

    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      function: "debitService.changeStatusDebit",
    });

    return new ServiceResponse(false);
  }
};

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.SYS_USERGROUP_OPTIONS);
};
const detailAccountDebit = async (accountNumber) => {
  try {
    const pool = await mssql.pool;

    const data = await pool
      .request()
      .input("ACCOUNTNUMBER", accountNumber)
      .execute(PROCEDURE_NAME.CUS_CUSTOMER_ACCOUNT_GETACCOUNT);
    let debit = DebitClass.detailAccountNumber(data.recordset[0]);

    // If exists SYS_USERGROUP
    if (debit) {
      return new ServiceResponse(true, "", debit);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, { function: "debitService.detailDebit" });

    return new ServiceResponse(false, e.message);
  }
};

const checkExitsPaymentAccount = async (accountNumber) => {
  try {
    let customer = await database.sequelize.query(
      `${PROCEDURE_NAME.CUS_CUSTOMER_ACCOUNT_CHECKACCOUNTEXITS} @ACCOUNTNUMBER=:ACCOUNTNUMBER`,
      {
        replacements: {
          ACCOUNTNUMBER: accountNumber,
        },
        type: database.QueryTypes.SELECT,
      }
    );

    return customer[0].RESULT;
  } catch (e) {
    logger.error(e, {
      function: "customerService.detailCustomer",
    });

    return null;
  }
};
const getPaymentInfo = async (debitId) => {
  try {
    const pool = await mssql.pool;

    const data = await pool
      .request()
      .input("CUSTOMERDEBITID", debitId)
      .execute(PROCEDURE_NAME.CUS_CUSTOMER_DEBIT_DETAIL);
    let debit = DebitClass.detail(data.recordset[0]);

    // If exists SYS_USERGROUP
    if (debit) {
      return new ServiceResponse(true, "", debit);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, { function: "debitService.detailDebit" });

    return new ServiceResponse(false, e.message);
  }
};
const getTemplateMail = async (mailType) => {
  try {
    const pool = await mssql.pool;

    const data = await pool
      .request()
      .input("MAILTYPE", mailType)
      .execute(PROCEDURE_NAME.MAILTYPE_GETBYKEY);
    let debit = DebitClass.mail(data.recordset[0]);

    // If exists SYS_USERGROUP
    if (debit) {
      return new ServiceResponse(true, "", debit);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, { function: "debitService.detailDebit" });

    return new ServiceResponse(false, e.message);
  }
};
const updateOTP = async (bodyParams = {}) => {
  const pool = await mssql.pool;

  const transaction = await new sql.Transaction(pool);

  try {
    // Begin transaction
    await transaction.begin();

    const requestDebit = new sql.Request(transaction);
    const resultDebit = await requestDebit
      .input(
        "CUSTOMERDEBITID",
        apiHelper.getValueFromObject(bodyParams, "customer_debit_id")
      )
      .input("OTP", apiHelper.getValueFromObject(bodyParams, "otp"))
      .input("CREATEDUSER", apiHelper.getValueFromObject(bodyParams, "auth_id"))
      .execute(PROCEDURE_NAME.CUS_CUSTOMER_DEBIT_UPDATE_OTP);
    // Get USERGROUPID
    const debitId = resultDebit.recordset[0].RESULT;

    // Commit transaction
    await transaction.commit();
    // Return ok
    return new ServiceResponse(true, "", debitId);
  } catch (e) {
    logger.error(e, { function: "debitService.createUserOrUpdate" });

    // Rollback transaction
    await transaction.rollback();

    // return new ServiceResponse(false, e.message); // Return error without error information
    return new ServiceResponse(false, e); // Return error with error information
    // return new ServiceResponse(false, 'Process failed', null, e); // Return error with customize message
    // throw e; // Return error default
  }
};

const cancelDebit = async (bodyParams = {}) => {
  const pool = await mssql.pool;

  const transaction = await new sql.Transaction(pool);

  try {
    // Begin transaction
    await transaction.begin();

    const requestDebit = new sql.Request(transaction);
    const resultDebit = await requestDebit
      .input(
        "CUSTOMERDEBITID",
        apiHelper.getValueFromObject(bodyParams, "customer_debit_id")
      )
      .input("CONTENT", apiHelper.getValueFromObject(bodyParams, "content"))
      .input("CREATEDUSER", apiHelper.getValueFromObject(bodyParams, "auth_id"))
      .execute(PROCEDURE_NAME.CUS_CUSTOMER_DEBIT_CANCEL_CREATE);
    // Get USERGROUPID
    const debitId = resultDebit.recordset[0].RESULT;

    // Commit transaction
    await transaction.commit();
    // Return ok
    return new ServiceResponse(true, "", debitId);
  } catch (e) {
    logger.error(e, { function: "debitService.createUserOrUpdate" });

    // Rollback transaction
    await transaction.rollback();

    // return new ServiceResponse(false, e.message); // Return error without error information
    return new ServiceResponse(false, e); // Return error with error information
    // return new ServiceResponse(false, 'Process failed', null, e); // Return error with customize message
    // throw e; // Return error default
  }
};

const doneDebit = async (bodyParams = {}) => {
  const pool = await mssql.pool;

  const transaction = await new sql.Transaction(pool);

  try {
    // Begin transaction
    await transaction.begin();

    const requestDebit = new sql.Request(transaction);
    const resultDebit = await requestDebit
      .input(
        "CUSTOMERDEBITID",
        apiHelper.getValueFromObject(bodyParams, "customer_debit_id")
      )
      .input("OTP", apiHelper.getValueFromObject(bodyParams, "otp"))
      .input("CREATEDUSER", apiHelper.getValueFromObject(bodyParams, "auth_id"))
      .execute(PROCEDURE_NAME.CUS_CUSTOMER_DEBIT_DONE_CREATE);
    // Get USERGROUPID
    const debitId = resultDebit.recordset[0].RESULT;

    // Commit transaction
    await transaction.commit();
    // Return ok
    return new ServiceResponse(true, "", debitId);
  } catch (e) {
    logger.error(e, { function: "debitService.createUserOrUpdate" });

    // Rollback transaction
    await transaction.rollback();

    // return new ServiceResponse(false, e.message); // Return error without error information
    return new ServiceResponse(false, e); // Return error with error information
    // return new ServiceResponse(false, 'Process failed', null, e); // Return error with customize message
    // throw e; // Return error default
  }
};

module.exports = {
  getListDebit,
  createDebit,
  detailDebit,
  updateDebit,
  deleteDebit,
  changeStatusDebit,
  detailAccountDebit,
  checkExitsPaymentAccount,
  cancelDebit,
  getTemplateMail,
  updateOTP,
  getPaymentInfo,
  doneDebit,
};
