const debitService = require("./debit.service");
const SingleResponse = require("../../common/responses/single.response");
const ListResponse = require("../../common/responses/list.response");
const RESPONSE_MSG = require("../../common/const/responseMsg.const");
const optionService = require("../../common/services/options.service");
const ErrorResponse = require("../../common/responses/error.response");
const mailHelper = require("../../common/helpers/mail.helper");
const httpStatus = require("http-status");

/**
 * Get list SYS_USERGROUP
 */
const getListDebit = async (req, res, next) => {
  try {
    req.query.customer_id = req.body.auth_id;
    const { list, total } = await debitService.getListDebit(req.query);
    return res.json(
      new ListResponse(list, total, req.query.page, req.query.itemsPerPage)
    );
  } catch (error) {
    return next(
      new ErrorResponse(
        httpStatus.NOT_IMPLEMENTED,
        error,
        RESPONSE_MSG.REQUEST_FAILED
      )
    );
  }
};

/**
 * Create new a SYS_USERGROUP
 */
const createDebit = async (req, res, next) => {
  try {
    req.body.customer_debit_id = null;

    const serviceRes = await debitService.createDebit(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(
      new SingleResponse(null, RESPONSE_MSG.USER_GROUP.CREATE_SUCCESS)
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
    const serviceResDetail = await debitService.detailDebit(debitId);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update debit
    const serviceRes = await debitService.updateDebit(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(
      new SingleResponse(null, RESPONSE_MSG.USER_GROUP.UPDATE_SUCCESS)
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
    const serviceResDetail = await debitService.detailDebit(debitId);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete debit
    const serviceRes = await debitService.deleteDebit(debitId, req);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(
      new SingleResponse(null, RESPONSE_MSG.USER_GROUP.DELETE_SUCCESS)
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
    const serviceRes = await debitService.detailDebit(req.params.debitId);
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
    const serviceResDetail = await debitService.detailDebit(debitId);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await debitService.changeStatusDebit(debitId, req.body);

    return res.json(
      new SingleResponse(null, RESPONSE_MSG.USER_GROUP.CHANGE_STATUS_SUCCESS)
    );
  } catch (error) {
    return next(error);
  }
};
/**
 * Get detail SYS_USERGROUP
 */
const detailAccountDebit = async (req, res, next) => {
  try {
    // Check customer name exists
    const customerAccountExist = await debitService.checkExitsPaymentAccount(
      req.params.accountNumber
    );
    if (customerAccountExist <= 0) {
      return res.json(
        new ErrorResponse(
          httpStatus.NOT_IMPLEMENTED,
          error,
          RESPONSE_MSG.REQUEST_FAILED
        )
      );
    }
    // Check debit exists
    const serviceRes = await debitService.detailAccountDebit(
      req.params.accountNumber
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
 * Create new a SYS_USERGROUP
 */
const cancelDebit = async (req, res, next) => {
  try {
    const serviceRes = await debitService.cancelDebit(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(
      new SingleResponse(null, RESPONSE_MSG.USER_GROUP.UPDATE_SUCCESS)
    );
  } catch (error) {
    return next(error);
  }
};
const doneDebit = async (req, res, next) => {
  try {
    const serviceRes = await debitService.doneDebit(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(
      new SingleResponse(null, RESPONSE_MSG.USER_GROUP.UPDATE_SUCCESS)
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Create new a SYS_USERGROUP
 */
const sendMailOTP = async (req, res, next) => {
  try {
    let customerdebitid = req.params.customerDebitId;
    let otp = Math.floor(Math.random() * 1000000 + 1);

    const infoRes = await debitService.getPaymentInfo(customerdebitid);
    console.log("infoRes", infoRes.data);
    let info = infoRes.data;
    const mailInfoRes = await debitService.getTemplateMail("THANHTOANNO");
    console.log("mailInfoRes", mailInfoRes.data);
    let mailData = mailInfoRes.data;
    const updateOTPRes = await debitService.updateOTP({
      customer_debit_id: customerdebitid,
      otp,
      auth_id: req.body.auth_id,
    });
    console.log("updateOTPRes", updateOTPRes);

    let rsm = await mailHelper.sendMail(
      info.email,
      "Thanh toán nợ thành công",
      mailData.mail_content
        .replace("##OTP", otp)
        .replace("##CUSTOMERNAME", info.account_holder)
    );
    console.log("sendMailOTP", rsm);
    // //check render email address
    // const serviceRes = await debitService.cancelDebit(req.body);
    // if (serviceRes.isFailed()) {
    //   return next(serviceRes);
    // }
    return res.json(
      new SingleResponse(null, RESPONSE_MSG.USER_GROUP.UPDATE_SUCCESS)
    );
  } catch (error) {
    console.log(error);
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
  detailAccountDebit,
  cancelDebit,
  sendMailOTP,
  doneDebit,
};
