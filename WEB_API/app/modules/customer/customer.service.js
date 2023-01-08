const database = require('../../models');
const CustomerClass = require('../customer/customer.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const stringHelper = require('../../common/helpers/string.helper');
const mssql = require('../../models/mssql');
const logger = require('../../common/classes/logger.class');
const ServiceResponse = require('../../common/responses/service.response');

const getListCustomer = async (req) => {
  try {
    const page = apiHelper.getPage(req);
    const limit = apiHelper.getLimit(req);

    const query = `${PROCEDURE_NAME.CUS_CUSTOMER_GETLIST} 
      @PageSize=:PageSize,
      @PageIndex=:PageIndex,
      @KEYWORD=:KEYWORD`;
    const customers = await database.sequelize.query(query, {
      replacements: {
        PageSize: limit,
        PageIndex: page,
        KEYWORD: apiHelper.getQueryParam(req, 'search'),
      },
      type: database.QueryTypes.SELECT,
    });

    return {
      data: CustomerClass.list(customers),
      page: page,
      limit: limit,
      total: apiHelper.getTotalData(customers),
    };
  } catch (e) {
    logger.error(e, {
      function: 'customerService.getListCustomer',
    });

    return [];
  }
};

const getListAccountCustomer = async (req) => {
  try {
    const page = apiHelper.getPage(req);
    const limit = apiHelper.getLimit(req);
    console.log('req.body.auth_id', req.body.auth_id);
    const query = `${PROCEDURE_NAME.CUS_CUSTOMER_ACCOUNT_GETLIST} 
      @PageSize=:PageSize,
      @PageIndex=:PageIndex,
      @CUSTOMERID=:CUSTOMERID,
      @KEYWORD=:KEYWORD`;
    const customers = await database.sequelize.query(query, {
      replacements: {
        PageSize: limit,
        PageIndex: page,
        KEYWORD: apiHelper.getQueryParam(req, 'search'),
        CUSTOMERID: req.body.auth_id,
      },
      type: database.QueryTypes.SELECT,
    });

    return {
      data: CustomerClass.listTaiKhoan(customers),
      page: page,
      limit: limit,
      total: apiHelper.getTotalData(customers),
    };
  } catch (e) {
    logger.error(e, {
      function: 'customerService.getListCustomer',
    });

    return [];
  }
};

const createCustomer = async (bodyParams = {}) => {
  try {
    const customerid = await createCustomerOrUpdate(bodyParams);
    return customerid;
  } catch (e) {
    logger.error(e, {
      function: 'customerService.createCustomer',
    });

    return null;
  }
};

const createCustomerOrUpdate = async (bodyParams) => {
  const params = bodyParams;

  let data = {
    USERNAME: params.user_name || '',
    FIRSTNAME: params.first_name || '',
    LASTNAME: params.last_name || '',
    FULLNAME: `${params.first_name} ${params.last_name}`,
    GENDER: params.gender || '',
    BIRTHDAY: params.birthday || '',
    EMAIL: params.email || '',
    PHONENUMBER: params.phone_number || '',
    ADDRESS: params.address || '',
    CREATEDUSER: params.auth_id,
  };

  let query = `${PROCEDURE_NAME.CUS_CUSTOMER_CREATEORUPDATE} 
        @USERNAME=:USERNAME,
        @FIRSTNAME=:FIRSTNAME,
        @LASTNAME=:LASTNAME,
        @FULLNAME=:FULLNAME,
        @GENDER=:GENDER,
        @BIRTHDAY=:BIRTHDAY,
        @EMAIL=:EMAIL,
        @PHONENUMBER=:PHONENUMBER,
        @ADDRESS=:ADDRESS,
        @CREATEDUSER=:CREATEDUSER`;
  if (params.customer_id) {
    data['USERID'] = params.customer_id;
    query += ',@USERID=:USERID';
  }
  if (params.password) {
    data['PASSWORD'] = stringHelper.hashPassword(params.password);
    query += ',@PASSWORD=:PASSWORD';
  }

  let transaction;
  try {
    // get transaction
    transaction = await database.sequelize.transaction();

    const result = await database.sequelize.query(query, {
      replacements: data,
      type: database.QueryTypes.INSERT,
      transaction: transaction,
    });
    if (!result) {
      if (transaction) {
        await transaction.rollback();
      }
      return null;
    }
    params.customer_id = result[0][0].RESULT;
    if (params.customer_id === '-1') {
      if (transaction) {
        await transaction.rollback();
      }
      return null;
    }
    await transaction.commit();
    return params.customer_id;
  } catch (err) {
    console.log('err.message', err.message);
    // Rollback transaction only if the transaction object is defined
    if (transaction) {
      await transaction.rollback();
    }
    return null;
  }
};

const findByCustomerName = async (userName) => {
  try {
    const customer = await database.sequelize.query(
      `${PROCEDURE_NAME.CUS_CUSTOMER_FINDBYUSERNAME} @UserName=:UserName`,
      {
        replacements: {
          UserName: userName,
        },
        type: database.QueryTypes.SELECT,
      },
    );

    if (customer.length) {
      return CustomerClass.detail(customer[0]);
    }

    return null;
  } catch (error) {
    console.error('customerService.findByUserNameName', error);
    return null;
  }
};

const findByEmail = async (email) => {
  try {
    const customer = await database.sequelize.query(
      `${PROCEDURE_NAME.CUS_CUSTOMER_FINDBYEMAIL} @EMAIL=:EMAIL`,
      {
        replacements: {
          EMAIL: email,
        },
        type: database.QueryTypes.SELECT,
      },
    );

    if (customer.length) {
      return CustomerClass.detail(customer[0]);
    }

    return null;
  } catch (error) {
    console.error('customerService.findByEmail', error);
    return null;
  }
};

const generateCustomerName = async () => {
  try {
    const customer = await database.sequelize.query(
      `${PROCEDURE_NAME.CUS_CUSTOMER_MAX}`,
      {
        replacements: {},
        type: database.QueryTypes.SELECT,
      },
    );

    let data = CustomerClass.generateCustomerName(customer[0]);
    data.customer_id = apiHelper.generateId();

    return data;
  } catch (error) {
    console.error('customerService.generateCustomername', error);
    return true;
  }
};

const createCustomerAccount = async (bodyParams) => {
  const params = bodyParams;

  let data = {
    CUSTOMERID: params.customer_id,
    ACCOUNTNUMBER: params.account_number || '',
    ACCOUNTHOLDER: params.account_holder || '',
    CURRENTBALANCE: params.current_balance,
    ISACCOUNTPAYMENT: params.is_account_payment,
    CREATEDUSER: params.auth_id,
  };

  let query = `${PROCEDURE_NAME.CUS_CUSTOMER_ACCOUNT_CREATEORUPDATE} 
        @CUSTOMERID=:CUSTOMERID,
        @ACCOUNTNUMBER=:ACCOUNTNUMBER,
        @ACCOUNTHOLDER=:ACCOUNTHOLDER,
        @CURRENTBALANCE=:CURRENTBALANCE,
        @ISACCOUNTPAYMENT=:ISACCOUNTPAYMENT,
        @CREATEDUSER=:CREATEDUSER`;

  try {
    const result = await database.sequelize.query(query, {
      replacements: data,
      type: database.QueryTypes.INSERT,
    });
    if (!result) {
      return null;
    }
    params.customer_id = result[0][0].RESULT;
    return params.customer_id;
  } catch (err) {
    console.log('err.message', err.message);
    return null;
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
      },
    );

    return customer[0].RESULT;
  } catch (e) {
    logger.error(e, {
      function: 'customerService.detailCustomer',
    });

    return null;
  }
};

const checkPaymentAccount = async (customerId) => {
  try {
    let customer = await database.sequelize.query(
      `${PROCEDURE_NAME.CUS_CUSTOMER_ACCOUNT_CHECKACCOUNTPAYMENT} @CUSTOMERID=:CUSTOMERID`,
      {
        replacements: {
          CUSTOMERID: customerId,
        },
        type: database.QueryTypes.SELECT,
      },
    );

    return customer[0].RESULT;
  } catch (e) {
    logger.error(e, {
      function: 'customerService.detailCustomer',
    });

    return null;
  }
};

const logCustomerLogin = async (data = {}) => {
  try {
    const pool = await mssql.pool;
    await pool
      .request()
      .input('CUSTOMERID', apiHelper.getValueFromObject(data, 'customer_id'))
      .input('LOGTYPE', apiHelper.getValueFromObject(data, 'log_type'))
      .execute(PROCEDURE_NAME.CUS_CUSTOMER_LOGIN_LOG_CREATE);

    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      function: 'customerService.logCustomerLogin',
    });

    return new ServiceResponse(true);
  }
};

const updatePaidCustomerAccount = async (bodyParams) => {
  const params = bodyParams;

  let data = {
    ACCOUNTNUMBER: params.account_number,
    CURRENTBALANCE: params.current_balance,
    UPDATEDUSERID: params.auth_id,
  };

  let query = `${PROCEDURE_NAME.CUS_CUSTOMER_ACCOUNT_UPDATECURRENTBALANCE} 
        @ACCOUNTNUMBER=:ACCOUNTNUMBER,
        @CURRENTBALANCE=:CURRENTBALANCE,
        @UPDATEDUSERID=:UPDATEDUSERID`;

  let transaction;
  try {
    transaction = await database.sequelize.transaction();
    const result = await database.sequelize.query(query, {
      replacements: data,
      type: database.QueryTypes.INSERT,
      transaction: transaction,
    });
    if (!result) {
      if (transaction) {
        await transaction.rollback();
      }
      return null;
    }
    params.customer_id = result[0][0].RESULT;

    let dataTransaction = {
      TRANSACTIONTYPE: 1,
      TRANSACTIONAMOUNT: params.current_balance,
      TRANSACTIONCONTENT: 'Nop tien vao tai khoan',
      TRANSACTIONCHARGECODE: '',
      TRANSACTIONCHARGEAMOUNT: 0,
      BANKID: -1,
      FROMACCOUNTNUMBER: '',
      TOACCOUNTNUMBER: params.account_number,
      CHECKSUM: '',
      CREATEDUSER: params.auth_id,
      OTP: '',
      ISACTIVE: 1,
    };

    let queryTransaction = `${PROCEDURE_NAME.BANK_TRANSACTION_HISTORY_CREATE} 
        @TRANSACTIONTYPE=:TRANSACTIONTYPE,
        @TRANSACTIONAMOUNT=:TRANSACTIONAMOUNT,
        @TRANSACTIONCONTENT=:TRANSACTIONCONTENT,
        @TRANSACTIONCHARGECODE=:TRANSACTIONCHARGECODE,
        @TRANSACTIONCHARGEAMOUNT=:TRANSACTIONCHARGEAMOUNT,
        @BANKID=:BANKID,
        @FROMACCOUNTNUMBER=:FROMACCOUNTNUMBER,
        @TOACCOUNTNUMBER=:TOACCOUNTNUMBER,
        @CHECKSUM=:CHECKSUM,
        @CREATEDUSER=:CREATEDUSER,
        @OTP=:OTP,
        @ISACTIVE=:ISACTIVE`;
    const resultTransaction = await database.sequelize.query(queryTransaction, {
      replacements: dataTransaction,
      type: database.QueryTypes.INSERT,
      transaction: transaction,
    });
    if (!resultTransaction) {
      if (transaction) {
        await transaction.rollback();
      }
      return null;
    }
    await transaction.commit();
    return params.customer_id;
  } catch (err) {
    console.log('err.message', err.message);
    if (transaction) {
      await transaction.rollback();
    }
    return null;
  }
};

const detailCustomer = async (customerId) => {
  try {
    let customer = await database.sequelize.query(
      `${PROCEDURE_NAME.CUS_CUSTOMER_GETCUSTOMERBYID} @CUSTOMERID=:CUSTOMERID`,
      {
        replacements: {
          CUSTOMERID: customerId,
        },
        type: database.QueryTypes.SELECT,
      },
    );

    if (customer.length) {
      customer = CustomerClass.detail(customer[0]);

      return customer;
    }

    return null;
  } catch (e) {
    logger.error(e, {
      function: 'customerService.detailCustomer',
    });

    return null;
  }
};

module.exports = {
  getListCustomer,
  createCustomer,
  findByCustomerName,
  findByEmail,
  generateCustomerName,
  createCustomerAccount,
  checkPaymentAccount,
  checkExitsPaymentAccount,
  updatePaidCustomerAccount,
  logCustomerLogin,
  detailCustomer,
  getListAccountCustomer,
};
