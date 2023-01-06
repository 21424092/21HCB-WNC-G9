const httpStatus = require("http-status");
const customerService = require("./customer.service");
const SingleResponse = require("../../common/responses/single.response");
const ListResponse = require("../../common/responses/list.response");
const ErrorResponse = require("../../common/responses/error.response");
const RESPONSE_MSG = require("../../common/const/responseMsg.const");
const ValidationResponse = require("../../common/responses/validation.response");
const apiHelper = require("../../common/helpers/api.helper");
const stringHelper = require("../../common/helpers/string.helper");

const getAccountByNumber = async (req, res, next) => {
  try {
    const accountNumber = apiHelper.getQueryParam(req, "accountnumber");
    console.log("accountNumber", accountNumber);
    if (!accountNumber) {
      return next(
        new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND)
      );
    }

    // Check customer exists
    const customer = await customerService.getAccountByNumber(accountNumber);
    if (!customer) {
      return next(
        new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND)
      );
    }

    return res.json(new SingleResponse(customer));
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

// /**
//  * Create new a customer
//  *
//  * @param req
//  * @param res
//  * @param next
//  * @returns {Promise<*>}
//  */
// const createCustomer = async (req, res, next) => {
//   try {
//     let params = req.body;
//     params.customer_id = null;
//     // // Check customer_name valid
//     // if (isNaN(customerName)) {
//     //   return next(new ValidationResponse("customer_name", "invalid"));
//     // }
//     // const customerPaymentExist = await customerService.findByCustomerName(
//     //     req.body.customer_name
//     //   );
//     // if () {
//     //   return next(new ValidationResponse("customer_name", "đã tồn tại tài khoản thanh toán"));
//     // }

//     // Check customer name exists
//     const customerExist = await customerService.findByCustomerName(
//       req.body.customer_name
//     );
//     if (customerExist) {
//       return next(
//         new ValidationResponse("customer_name", "đã tồn tại tài khoản")
//       );
//     }

//     // Check email exists
//     const emailExist = await customerService.findByEmail(req.body.email);
//     if (emailExist) {
//       return next(new ValidationResponse("email", "already  exists"));
//     }

//     const result = await customerService.createCustomer(params);

//     if (!result) {
//       return next(
//         new ErrorResponse(null, null, RESPONSE_MSG.CUSTOMER.CREATE_FAILED)
//       );
//     }

//     return res.json(
//       new SingleResponse(result, RESPONSE_MSG.CUSTOMER.CREATE_SUCCESS)
//     );
//   } catch (error) {
//     return next(
//       new ErrorResponse(
//         httpStatus.NOT_IMPLEMENTED,
//         error,
//         RESPONSE_MSG.REQUEST_FAILED
//       )
//     );
//   }
// };

module.exports = {
  getAccountByNumber,
};
