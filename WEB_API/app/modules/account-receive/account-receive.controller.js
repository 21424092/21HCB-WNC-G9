const accountReceiveService = require('./account-receive.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

/**
 * Get list SYS_USERGROUP
 */
const getListAccountReceive = async (req, res, next) => {
  try {
    const serviceRes = await accountReceiveService.getListAccountReceive(
      req.query,
    );
    const { data, total, page, limit } = serviceRes.getData();

    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create new a SYS_USERGROUP
 */
const createAccountReceive = async (req, res, next) => {
  try {
    req.body.customer_account_receive_id = null;

    const serviceRes = await accountReceiveService.createAccountReceive(
      req.body,
    );
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(
      new SingleResponse(null, RESPONSE_MSG.USER_GROUP.CREATE_SUCCESS),
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Update a accountReceive
 */
const updateAccountReceive = async (req, res, next) => {
  try {
    const accountReceiveId = req.params.accountReceiveId;
    req.body.customer_account_receive_id = accountReceiveId;

    // Check accountReceive exists
    const serviceResDetail = await accountReceiveService.detailAccountReceive(
      accountReceiveId,
    );
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update accountReceive
    const serviceRes = await accountReceiveService.updateAccountReceive(
      req.body,
    );
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(
      new SingleResponse(null, RESPONSE_MSG.USER_GROUP.UPDATE_SUCCESS),
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete SYS_USERGROUP
 */
const deleteAccountReceive = async (req, res, next) => {
  try {
    const accountReceiveId = req.params.accountReceiveId;

    // Check accountReceive exists
    const serviceResDetail = await accountReceiveService.detailAccountReceive(
      accountReceiveId,
    );
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete accountReceive
    const serviceRes = await accountReceiveService.deleteAccountReceive(
      accountReceiveId,
      req,
    );
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(
      new SingleResponse(null, RESPONSE_MSG.USER_GROUP.DELETE_SUCCESS),
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail SYS_USERGROUP
 */
const detailAccountReceive = async (req, res, next) => {
  try {
    console.log(req.params);
    // Check accountReceive exists
    const serviceRes = await accountReceiveService.detailAccountReceive(
      req.params.accountReceiveId,
    );
    console.log('serviceRes', serviceRes);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status SYS_USERGROUP
 */
const changeStatusAccountReceive = async (req, res, next) => {
  try {
    const accountReceiveId = req.params.accountReceiveId;

    // Check accountReceive exists
    const serviceResDetail = await accountReceiveService.detailAccountReceive(
      accountReceiveId,
    );
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await accountReceiveService.changeStatusAccountReceive(
      accountReceiveId,
      req.body,
    );

    return res.json(
      new SingleResponse(null, RESPONSE_MSG.USER_GROUP.CHANGE_STATUS_SUCCESS),
    );
  } catch (error) {
    return next(error);
  }
};

const getOptions = async (req, res, next) => {
  try {
    const serviceRes = await optionService(
      'CUS_CUSTOMER_ACCOUNT_RECEIVE',
      req.query,
    );

    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getListBank = async (req, res, next) => {
  try {
    const serviceRes = await optionService('BANK_PARTNER', req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListAccountReceive,
  createAccountReceive,
  updateAccountReceive,
  deleteAccountReceive,
  detailAccountReceive,
  changeStatusAccountReceive,
  getOptions,
  getListBank,
};
