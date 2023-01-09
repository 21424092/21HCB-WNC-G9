const debitService = require('./debit.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

/**
 * Get list SYS_USERGROUP
 */
const getListDebit = async (req, res, next) => {
  try {
    const serviceRes = await debitService.getListDebit(
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
const createDebit = async (req, res, next) => {
  try {
    req.body.customer_debit_id = null;

    const serviceRes = await debitService.createDebit(
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
 * Update a debit
 */
const updateDebit = async (req, res, next) => {
  try {
    const debitId = req.params.debitId;
    req.body.customer_debit_id = debitId;

    // Check debit exists
    const serviceResDetail = await debitService.detailDebit(
      debitId,
    );
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update debit
    const serviceRes = await debitService.updateDebit(
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
const deleteDebit = async (req, res, next) => {
  try {
    const debitId = req.params.debitId;

    // Check debit exists
    const serviceResDetail = await debitService.detailDebit(
      debitId,
    );
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete debit
    const serviceRes = await debitService.deleteDebit(
      debitId,
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
const detailDebit = async (req, res, next) => {
  try {
    // Check debit exists
    const serviceRes = await debitService.detailDebit(
      req.params.debitId,
    );
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
const changeStatusDebit = async (req, res, next) => {
  try {
    const debitId = req.params.debitId;

    // Check debit exists
    const serviceResDetail = await debitService.detailDebit(
      debitId,
    );
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await debitService.changeStatusDebit(
      debitId,
      req.body,
    );

    return res.json(
      new SingleResponse(null, RESPONSE_MSG.USER_GROUP.CHANGE_STATUS_SUCCESS),
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListDebit,
  createDebit,
  updateDebit,
  deleteDebit,
  detailDebit,
  changeStatusDebit,
};
