const AccountReceiveClass = require("../account-receive/account-receive.class");
const PROCEDURE_NAME = require("../../common/const/procedureName.const");
const apiHelper = require("../../common/helpers/api.helper");
const mssql = require("../../models/mssql");
const sql = require("mssql");
const ServiceResponse = require("../../common/responses/service.response");
const RESPONSE_MSG = require("../../common/const/responseMsg.const");
const logger = require("../../common/classes/logger.class");
const cacheHelper = require("../../common/helpers/cache.helper");
const CACHE_CONST = require("../../common/const/cache.const");

/**
 * Get list SYS_USERGROUP
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListAccountReceive = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);
    const orderBy = apiHelper.getOrderBy(queryParams);

    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input("PageSize", itemsPerPage)
      .input("PageIndex", currentPage)
      .input("KEYWORD", keyword)
      .input("ORDERBYDES", orderBy)
      .input("ISACTIVE", apiHelper.getFilterBoolean(queryParams, "is_active"))
      .execute(PROCEDURE_NAME.CUS_CUSTOMER_ACCOUNT_RECEIVE_GETLIST);

    const accountReceives = data.recordset;

    return new ServiceResponse(true, "", {
      data: AccountReceiveClass.list(accountReceives),
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(accountReceives),
    });
  } catch (e) {
    logger.error(e, {
      function: "accountReceiveService.getListAccountReceive",
    });

    return new ServiceResponse(true, "", {});
  }
};

/**
 * Create SYS_USERGROUP
 *
 * @param bodyParams
 * @returns ServiceResponse
 */
const createAccountReceive = async (bodyParams = {}) => {
  return await createUserOrUpdate(bodyParams);
};

const updateAccountReceive = async (bodyParams = {}) => {
  return await createUserOrUpdate(bodyParams);
};

const createUserOrUpdate = async (bodyParams = {}) => {
  const pool = await mssql.pool;

  const transaction = await new sql.Transaction(pool);

  try {
    // Begin transaction
    await transaction.begin();

    // Save SYS_USERGROUP
    const requestAccountReceive = new sql.Request(transaction);
    const resultAccountReceive = await requestAccountReceive
      .input(
        "CUSTOMERACCOUNTRECEIVEID",
        apiHelper.getValueFromObject(bodyParams, "customer_account_receive_id")
      )
      .input(
        "ACCOUNTNUMBER",
        apiHelper.getValueFromObject(bodyParams, "account_number")
      )
      .input(
        "ACCOUNTHOLDER",
        apiHelper.getValueFromObject(bodyParams, "account_holder")
      )
      .input("NICKNAME", apiHelper.getValueFromObject(bodyParams, "nickname"))
      .input("BANKID", apiHelper.getValueFromObject(bodyParams, "bank_id"))
      .input("ISACTIVE", apiHelper.getValueFromObject(bodyParams, "is_active"))
      .input("CREATEDUSER", apiHelper.getValueFromObject(bodyParams, "auth_id"))
      .execute(PROCEDURE_NAME.CUS_CUSTOMER_ACCOUNT_RECEIVE_CREATEORUPDATE);
    // Get USERGROUPID
    const accountReceiveId = resultAccountReceive.recordset[0].RESULT;

    // Commit transaction
    await transaction.commit();

    removeCacheOptions();

    // Return ok
    return new ServiceResponse(true, "", accountReceiveId);
  } catch (e) {
    logger.error(e, { function: "accountReceiveService.createUserOrUpdate" });

    // Rollback transaction
    await transaction.rollback();

    // return new ServiceResponse(false, e.message); // Return error without error information
    return new ServiceResponse(false, e); // Return error with error information
    // return new ServiceResponse(false, 'Process failed', null, e); // Return error with customize message
    // throw e; // Return error default
  }
};

const detailAccountReceive = async (accountReceiveId) => {
  try {
    const pool = await mssql.pool;

    const data = await pool
      .request()
      .input("CUSTOMERACCOUNTRECEIVEID", accountReceiveId)
      .execute(PROCEDURE_NAME.CUS_CUSTOMER_ACCOUNT_RECEIVE_DETAIL);

    let accountReceiveFunctions = data.recordsets[0];
    let accountReceive = data.recordsets[1];

    // If exists SYS_USERGROUP
    if (accountReceive) {
      return new ServiceResponse(true, "", accountReceive);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, { function: "accountReceiveService.detailAccountReceive" });

    return new ServiceResponse(false, e.message);
  }
};

const deleteAccountReceive = async (accountReceiveId, req) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);

  try {
    // Begin transaction
    await transaction.begin();

    // Delete user group
    const requestAccountReceive = new sql.Request(transaction);
    await requestAccountReceive
      .input("CUSTOMERACCOUNTRECEIVEID", accountReceiveId)
      .input("UPDATEDUSER", apiHelper.getAuthId(req))
      .execute(PROCEDURE_NAME.CUS_CUSTOMER_ACCOUNT_RECEIVE_DELETE);

    // Commit transaction
    await transaction.commit();

    removeCacheOptions();

    // Return ok
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, { function: "accountReceiveService.deleteAccountReceive" });

    // Rollback transaction
    await transaction.rollback();

    // Return failed
    return new ServiceResponse(false, e.message);
  }
};

const changeStatusAccountReceive = async (accountReceiveId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool
      .request()
      .input("CUSTOMERACCOUNTRECEIVEID", accountReceiveId)
      .input("ISACTIVE", apiHelper.getValueFromObject(bodyParams, "is_active"))
      .input("UPDATEDUSER", apiHelper.getValueFromObject(bodyParams, "auth_id"))
      .execute(PROCEDURE_NAME.CUS_CUSTOMER_ACCOUNT_RECEIVE_CHANGESTATUS);

    removeCacheOptions();

    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      function: "accountReceiveService.changeStatusAccountReceive",
    });

    return new ServiceResponse(false);
  }
};

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.SYS_USERGROUP_OPTIONS);
};

module.exports = {
  getListAccountReceive,
  createAccountReceive,
  detailAccountReceive,
  updateAccountReceive,
  deleteAccountReceive,
  changeStatusAccountReceive,
};
