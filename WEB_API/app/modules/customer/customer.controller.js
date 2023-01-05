const httpStatus = require("http-status");
const customerService = require("./customer.service");
const SingleResponse = require("../../common/responses/single.response");
const ListResponse = require("../../common/responses/list.response");
const ErrorResponse = require("../../common/responses/error.response");
const RESPONSE_MSG = require("../../common/const/responseMsg.const");
const ValidationResponse = require("../../common/responses/validation.response");
const apiHelper = require("../../common/helpers/api.helper");
const stringHelper = require("../../common/helpers/string.helper");
/**
 * Get list customer
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListCustomer = async (req, res, next) => {
  try {
    const customers = await customerService.getListCustomer(req);

    return res.json(
      new ListResponse(
        customers["data"],
        customers["total"],
        customers["page"],
        customers["limit"]
      )
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
 * Create new a customer
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createCustomer = async (req, res, next) => {
  try {
    let params = req.body;  
    params.customer_id = null;
    // // Check customer_name valid
    // if (isNaN(customerName)) {
    //   return next(new ValidationResponse("customer_name", "invalid"));
    // }
    // const customerPaymentExist = await customerService.findByCustomerName(
    //     req.body.customer_name
    //   );
    // if () {
    //   return next(new ValidationResponse("customer_name", "đã tồn tại tài khoản thanh toán"));
    // }

    // Check customer name exists
    const customerExist = await customerService.findByCustomerName(
      req.body.customer_name
    );
    if (customerExist) {
      return next(new ValidationResponse("customer_name", "đã tồn tại tài khoản"));
    }

    // Check email exists
    const emailExist = await customerService.findByEmail(req.body.email);
    if (emailExist) {
      return next(new ValidationResponse("email", "already  exists"));
    }

    const result = await customerService.createCustomer(params);

    if (!result) {
      return next(
        new ErrorResponse(null, null, RESPONSE_MSG.CUSTOMER.CREATE_FAILED)
      );
    }

    return res.json(
      new SingleResponse(result, RESPONSE_MSG.CUSTOMER.CREATE_SUCCESS)
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
 * Update a customer
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateCustomer = async (req, res, next) => {
  try {
    let params = req.body;
    // Check customer exists
    const customer = await customerService.detailCustomer(
      req.params.customerId
    );
    if (!customer) {
      return next(
        new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND)
      );
    }

    params.customer_id = req.params.customerId;
    params.customer_name = customer.customer_name;
    // Update customer
    const result = await customerService.updateCustomer(params);

    if (!result) {
      return next(
        new ErrorResponse(null, null, RESPONSE_MSG.CUSTOMER.UPDATE_FAILED)
      );
    }

    return res.json(
      new SingleResponse(result, RESPONSE_MSG.CUSTOMER.UPDATE_SUCCESS)
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

const deleteCustomer = async (req, res, next) => {
  try {
    const customerId = req.params.customerId;

    // Check customer exists
    const customer = await customerService.detailCustomer(customerId);
    if (!customer) {
      return next(
        new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND)
      );
    }

    // Delete customer
    await customerService.deleteCustomer(customerId, req);

    return res.json(
      new SingleResponse(null, RESPONSE_MSG.CUSTOMER.DELETE_SUCCESS)
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

const detailCustomer = async (req, res, next) => {
  try {
    const customerId = req.params.customerId;

    // Check customer exists
    const customer = await customerService.detailCustomer(customerId);
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

const resetPassword = async (req, res, next) => {
  try {
    const customerId = req.params.customerId;

    // Check customer exists
    const customer = await customerService.detailCustomer(customerId);
    if (!customer) {
      return next(
        new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND)
      );
    }
    await customerService.changePasswordCustomer(
      customerId,
      req.body.password,
      apiHelper.getAuthId(req)
    );

    return res.json(
      new SingleResponse(null, RESPONSE_MSG.CUSTOMER.UPDATE_PASSWORD_SUCCESS)
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

const changePasswordCustomer = async (req, res, next) => {
  try {
    const customerId = req.params.customerId;

    // Check customer exists
    const customer = await customerService.detailCustomer(customerId);
    if (!customer) {
      return next(
        new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND)
      );
    }
    const hashpassword = await customerService.checkPassword(customerId);
    if (!stringHelper.comparePassword(req.body.old_password, hashpassword)) {
      return next(
        new ErrorResponse(
          httpStatus.BAD_REQUEST,
          null,
          RESPONSE_MSG.CUSTOMER.OLD_PASSWORD_WRONG
        )
      );
    }
    // Update password of customer
    await customerService.changePasswordCustomer(
      customerId,
      req.body.new_password,
      apiHelper.getAuthId(req)
    );

    return res.json(
      new SingleResponse(null, RESPONSE_MSG.CUSTOMER.UPDATE_PASSWORD_SUCCESS)
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

const getOptions = async (req, res, next) => {
  try {
    const serviceRes = await customerService.getOptionsAll(req);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  detailCustomer,
  resetPassword,
  changePasswordCustomer,
  getOptions,
};
