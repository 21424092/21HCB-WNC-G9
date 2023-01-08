const DebitClass = require('../account-receive/account-receive.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');

/**
 * Get list SYS_USERGROUP
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListDebit = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .execute(PROCEDURE_NAME.CUS_CUSTOMER_DEBIT_GETLIST);

    const debits = data.recordset;

    return new ServiceResponse(true, '', {
      data: DebitClass.list(debits),
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(debits),
    });
  } catch (e) {
    logger.error(e, {
      function: 'debitService.getListDebit',
    });

    return new ServiceResponse(true, '', {});
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

    // Save SYS_USERGROUP
    const requestDebit = new sql.Request(transaction);
    const resultDebit = await requestDebit
      .input(
        'CUSTOMERDEBITID',
        apiHelper.getValueFromObject(bodyParams, 'customer_account_receive_id'),
      )
      .input(
        'ACCOUNTNUMBER',
        apiHelper.getValueFromObject(bodyParams, 'account_number'),
      )
      .input(
        'ACCOUNTHOLDER',
        apiHelper.getValueFromObject(bodyParams, 'account_holder'),
      )
      .input('NICKNAME', apiHelper.getValueFromObject(bodyParams, 'nickname'))
      .input('BANKID', apiHelper.getValueFromObject(bodyParams, 'bank_id'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_id'))
      .execute(PROCEDURE_NAME.CUS_CUSTOMER_DEBIT_CREATEORUPDATE);
    // Get USERGROUPID
    const debitId = resultDebit.recordset[0].RESULT;

    // Commit transaction
    await transaction.commit();

    removeCacheOptions();

    // Return ok
    return new ServiceResponse(true, '', debitId);
  } catch (e) {
    logger.error(e, { function: 'debitService.createUserOrUpdate' });

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
      .input('CUSTOMERDEBITID', debitId)
      .execute(PROCEDURE_NAME.CUS_CUSTOMER_DEBIT_DETAIL);
    let debit = DebitClass.detail(data.recordset[0]);

    // If exists SYS_USERGROUP
    if (debit) {
      return new ServiceResponse(true, '', debit);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, { function: 'debitService.detailDebit' });

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
      .input('CUSTOMERDEBITID', debitId)
      .input('UPDATEDUSER', apiHelper.getAuthId(req))
      .execute(PROCEDURE_NAME.CUS_CUSTOMER_DEBIT_DELETE);

    // Commit transaction
    await transaction.commit();

    removeCacheOptions();

    // Return ok
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, { function: 'debitService.deleteDebit' });

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
      .input('CUSTOMERDEBITID', debitId)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_id'))
      .execute(PROCEDURE_NAME.CUS_CUSTOMER_DEBIT_CHANGESTATUS);

    removeCacheOptions();

    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      function: 'debitService.changeStatusDebit',
    });

    return new ServiceResponse(false);
  }
};

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.SYS_USERGROUP_OPTIONS);
};

module.exports = {
  getListDebit,
  createDebit,
  detailDebit,
  updateDebit,
  deleteDebit,
  changeStatusDebit,
};
