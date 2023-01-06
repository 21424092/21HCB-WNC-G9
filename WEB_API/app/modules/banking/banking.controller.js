const httpStatus = require("http-status");
const bankingService = require("./banking.service");
const SingleResponse = require("../../common/responses/single.response");
const ErrorResponse = require("../../common/responses/error.response");
const RESPONSE_MSG = require("../../common/const/responseMsg.const");
const ValidationResponse = require("../../common/responses/validation.response");

/**
 * Create new a transaction
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createTransaction = async (req, res, next) => {
  try {
    let { bankid } = req.bankInfo;
    let model = Object.assign({}, { bankid }, req.body);
    const result = await bankingService.createTransaction(model);
    if (result) {
      return res.json(
        new SingleResponse(result, RESPONSE_MSG.REQUEST_SUCCESS)
      );
    } else {
      return next(
        new ErrorResponse(
          httpStatus.BAD_REQUEST,
          null,
          RESPONSE_MSG.REQUEST_FAILED
        )
      );
    }
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

module.exports = {
  createTransaction,
};
