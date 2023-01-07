<<<<<<< HEAD
const database = require('../../models');
const CustomerClass = require('../customer/customer.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const stringHelper = require('../../common/helpers/string.helper');
const mssql = require('../../models/mssql');
const logger = require('../../common/classes/logger.class');
const API_CONST = require('../../common/const/api.const');
const ServiceResponse = require('../../common/responses/service.response');
const config = require('../../../config/config');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const cache = require('../../common/classes/cache.class');
const _ = require('lodash');
=======
const database = require("../../models");
const CustomerClass = require("../customer/customer.class");
const PROCEDURE_NAME = require("../../common/const/procedureName.const");
const apiHelper = require("../../common/helpers/api.helper");
const stringHelper = require("../../common/helpers/string.helper");
const fileHelper = require("../../common/helpers/file.helper");
const mssql = require("../../models/mssql");
const logger = require("../../common/classes/logger.class");
const API_CONST = require("../../common/const/api.const");
const ServiceResponse = require("../../common/responses/service.response");
const folderNameAvatar = "avatar";
const config = require("../../../config/config");
const cacheHelper = require("../../common/helpers/cache.helper");
const CACHE_CONST = require("../../common/const/cache.const");
const cache = require("../../common/classes/cache.class");
const _ = require("lodash");
>>>>>>> e51d7304c1a658cc38d9bfce8fbcbb7ae8889b0c

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

const createCustomer = async (bodyParams = {}) => {
  try {
    const customerid = await createCustomerOrUpdate(bodyParams);
    removeCacheOptions();
    return customerid;
  } catch (e) {
    logger.error(e, {
      function: 'customerService.createCustomer',
    });

    return null;
  }
};

const updateCustomer = async (bodyParams) => {
  try {
    const customerid = await createCustomerOrUpdate(bodyParams);
    removeCacheOptions();
    return customerid;
  } catch (e) {
    logger.error(e, {
      function: 'customerService.updateCustomer',
    });

    return null;
  }
};

const createCustomerOrUpdate = async (bodyParams) => {
  const params = bodyParams;

  let data = {
    USERNAME: params.customer_name || '',
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

const detailCustomer = async (customerId) => {
  try {
    let customer = await database.sequelize.query(
      `${PROCEDURE_NAME.CUS_CUSTOMER_GETCUSTOMERBYID} @CUSTOMERID=:CUSTOMERID`,
      {
        replacements: {
          CUSTOMERID: customerId,
        },
        type: database.QueryTypes.SELECT,
      }
    );

    if (customer.length) {
      customer = CustomerClass.detail(customer[0]);
      customer.isAdministrator =
        customer.customer_name === config.adminCustomerName ? 1 : 0;

      return customer;
    }

    return null;
  } catch (e) {
    logger.error(e, {
      function: "customerService.detailCustomer",
    });

    return null;
  }
};

<<<<<<< HEAD
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

const deleteCustomer = async (customerId, req) => {
  try {
    await database.sequelize.query(
      `${PROCEDURE_NAME.CUS_CUSTOMER_DELETE} @CUSTOMERID=:CUSTOMERID,@UPDATEDUSER=:UPDATEDUSER`,
      {
        replacements: {
          CUSTOMERID: customerId,
          UPDATEDUSER: apiHelper.getAuthId(req),
        },
        type: database.QueryTypes.UPDATE,
      },
    );
    removeCacheOptions();
    return true;
  } catch (error) {
    console.error('customerService.deleteCustomer', error);
    return false;
  }
};

const changePasswordCustomer = async (customerId, password, authId) => {
  try {
    await database.sequelize.query(
      `${PROCEDURE_NAME.CUS_CUSTOMER_CHANGEPASSWORD} @CUSTOMERID=:CUSTOMERID,@PASSWORD=:PASSWORD,@UPDATEDUSER=:UPDATEDUSER`,
      {
        replacements: {
          CUSTOMERID: customerId,
          PASSWORD: stringHelper.hashPassword(password),
          UPDATEDUSER: authId,
        },
        type: database.QueryTypes.UPDATE,
      },
    );
=======
// const createCustomer = async (bodyParams = {}) => {
//   try {
//     const customerid = await createCustomerOrUpdate(bodyParams);
//     removeCacheOptions();
//     return customerid;
//   } catch (e) {
//     logger.error(e, {
//       function: "customerService.createCustomer",
//     });
>>>>>>> e51d7304c1a658cc38d9bfce8fbcbb7ae8889b0c

    return true;
  } catch (error) {
    console.error('customerService.changePasswordCustomer', error);
    return false;
  }
};

<<<<<<< HEAD
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

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.CUS_CUSTOMER_OPTIONS);
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

// const getOptions = async (req) => {
//   try {
//     const query = `${PROCEDURE_NAME.SYS_USER_GETOPTIONS}
//       @IsActive=:IsActive`;
//     const customers = await database.sequelize.query(query, {
//       replacements: {
//         IsActive: API_CONST.ISACTIVE.ALL,
//       },
//       type: database.QueryTypes.SELECT,
//     });

//     return customers;
//   } catch (e) {
//     logger.error(e, {
//       function: "customerService.getOptions",
//     });

//     return [];
//   }
// };

module.exports = {
  getListCustomer,
  createCustomer,
  detailCustomer,
  updateCustomer,
  deleteCustomer,
  changePasswordCustomer,
  findByCustomerName,
  generateCustomerName,
  logCustomerLogin,
  findByEmail,
=======
module.exports = {
  getAccountByNumber,
>>>>>>> e51d7304c1a658cc38d9bfce8fbcbb7ae8889b0c
};
