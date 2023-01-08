const httpStatus = require('http-status');
const customerService = require('./customer.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ValidationResponse = require('../../common/responses/validation.response');
const optionService = require('../../common/services/options.service');

const getListCustomer = async (req, res, next) => {
  try {
    const customers = await customerService.getListCustomer(req);

    return res.json(
      new ListResponse(
        customers['data'],
        customers['total'],
        customers['page'],
        customers['limit'],
      ),
    );
  } catch (error) {
    return next(
      new ErrorResponse(
        httpStatus.NOT_IMPLEMENTED,
        error,
        RESPONSE_MSG.REQUEST_FAILED,
      ),
    );
  }
};


const getListAccountCustomer = async (req, res, next) => {
  try {
    const customers = await customerService.getListAccountCustomer(req);

    return res.json(
      new ListResponse(
        customers['data'],
        customers['total'],
        customers['page'],
        customers['limit'],
      ),
    );
  } catch (error) {
    return next(
      new ErrorResponse(
        httpStatus.NOT_IMPLEMENTED,
        error,
        RESPONSE_MSG.REQUEST_FAILED,
      ),
    );
  }
};

const createCustomer = async (req, res, next) => {
  try {
    let params = req.body;
    params.customer_id = null;
    // Check customer name exists
    const customerExist = await customerService.findByCustomerName(
      req.body.user_name,
    );
    if (customerExist) {
      const customer = await customerService.generateCustomerName();
      params.user_name = customer.user_name;
    }

    // Check email exists
    const emailExist = await customerService.findByEmail(req.body.email);
    if (emailExist) {
      return next(new ValidationResponse('email', 'already  exists'));
    }

    const result = await customerService.createCustomer(params);

    if (!result) {
      return next(
        new ErrorResponse(null, null, RESPONSE_MSG.USER.CREATE_FAILED),
      );
    }

    return res.json(
      new SingleResponse(result, RESPONSE_MSG.USER.CREATE_SUCCESS),
    );
  } catch (error) {
    return next(
      new ErrorResponse(
        httpStatus.NOT_IMPLEMENTED,
        error,
        RESPONSE_MSG.REQUEST_FAILED,
      ),
    );
  }
};

const createCustomerAccount = async (req, res, next) => {
  try {
    let params = req.body;
    // Check customer name exists
    const customerAccountExist = await customerService.checkExitsPaymentAccount(
      req.body.account_number,
    );
    if (customerAccountExist > 0) {
      return next(new ErrorResponse(null, null, 'Số tài khoản đã tồn tại'));
    }

    // Check customer name exists
    const customerAccountPaymentExist =
      await customerService.checkPaymentAccount(req.body.customer_id);
    if (customerAccountPaymentExist > 0) {
      params.is_account_payment = true;
    } else {
      params.is_account_payment = false;
    }

    const result = await customerService.createCustomerAccount(params);

    if (!result) {
      return next(
        new ErrorResponse(
          null,
          null,
          'Tạo tài khoản cho người dùng không thành công',
        ),
      );
    }

    return res.json(
      new SingleResponse(result, RESPONSE_MSG.USER.CREATE_SUCCESS),
    );
  } catch (error) {
    console.log(error);
    return next(
      new ErrorResponse(
        httpStatus.NOT_IMPLEMENTED,
        error,
        RESPONSE_MSG.REQUEST_FAILED,
      ),
    );
  }
};

const getListCustomerAccount = async (req, res, next) => {
  try {
    const serviceRes = await optionService('CUS_CUSTOMER_ACCOUNT', {
      parent_id: req.params.customerId,
    });
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const updatePaidAccount = async (req, res, next) => {
  try {
    let params = req.body;
    // Check customer name exists
    const customerAccountExist = await customerService.checkExitsPaymentAccount(
      req.body.account_number,
    );
    if (customerAccountExist <= 0) {
      return next(new ErrorResponse(null, null, 'Số tài khoản không tồn tại'));
    }

    const result = await customerService.updatePaidCustomerAccount(params);
    if (!result) {
      return next(
        new ErrorResponse(
          null,
          null,
          'Nộp tiền tài khoản cho người dùng không thành công',
        ),
      );
    }

    return res.json(
      new SingleResponse(result, RESPONSE_MSG.USER.CREATE_SUCCESS),
    );
  } catch (error) {
    console.log(error);
    return next(
      new ErrorResponse(
        httpStatus.NOT_IMPLEMENTED,
        error,
        RESPONSE_MSG.REQUEST_FAILED,
      ),
    );
  }
};
module.exports = {
  getListCustomer,
  createCustomer,
  createCustomerAccount,
  getListCustomerAccount,
  updatePaidAccount,
  getListAccountCustomer,
};
