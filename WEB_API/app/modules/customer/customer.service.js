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

const getListCustomer = async (req) => {
  try {
    const page = apiHelper.getPage(req);
    const limit = apiHelper.getLimit(req);

    const query = `${PROCEDURE_NAME.CUS_CUSTOMER_GETLIST} 
      @PageSize=:PageSize,
      @PageIndex=:PageIndex,
      @KEYWORD=:KEYWORD,
      @BIRTHDAY=:BIRTHDAY,
      @GENDER=:GENDER,
      @ORDERBYDES=:ORDERBYDES`;
    const customers = await database.sequelize.query(query, {
      replacements: {
        PageSize: limit,
        PageIndex: page,
        KEYWORD: apiHelper.getQueryParam(req, "search"),
        BIRTHDAY: apiHelper.getQueryParam(req, "birthday"),
        GENDER: apiHelper.getQueryParam(req, "gender"),
        ORDERBYDES: apiHelper.getQueryParam(req, "sortorder"),
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
      function: "customerService.getListCustomer",
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
      function: "customerService.createCustomer",
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
      function: "customerService.updateCustomer",
    });

    return null;
  }
};

const saveAvatar = async (base64, customerId) => {
  let avatarUrl = null;

  try {
    if (fileHelper.isBase64(base64)) {
      const extension = fileHelper.getExtensionFromBase64(base64);
      avatarUrl = await fileHelper.saveBase64(
        folderNameAvatar,
        base64,
        `${customerId}.${extension}`
      );
    } else {
      avatarUrl = base64.split(config.domain_cdn)[1];
    }
  } catch (e) {
    logger.error(e, {
      function: "customerService.saveAvatar",
    });

    return avatarUrl;
  }

  return avatarUrl;
};

const createCustomerOrUpdate = async (bodyParams) => {
  const params = bodyParams;

  // Upload Avatar
  const pathAvatar = await saveAvatar(
    params.default_picture_url,
    params.customer_id
  );
  if (pathAvatar) {
    params.default_picture_url = pathAvatar;
  }

  let data = {
    CUSTOMERNAME: params.customer_name || "",
    FIRSTNAME: params.first_name || "",
    LASTNAME: params.last_name || "",
    FULLNAME: `${params.first_name} ${params.last_name}`,
    GENDER: params.gender || "",
    BIRTHDAY: params.birthday || "",
    EMAIL: params.email || "",
    PHONENUMBER: params.phone_number || "",
    ADDRESS: params.address || "",
    CREATEDUSER: params.auth_id,
    DEFAULTPICTUREURL: params.default_picture_url,
  };

  let query = `${PROCEDURE_NAME.CUS_CUSTOMER_CREATEORUPDATE} 
        @CUSTOMERNAME=:CUSTOMERNAME,
        @FIRSTNAME=:FIRSTNAME,
        @LASTNAME=:LASTNAME,
        @FULLNAME=:FULLNAME,
        @GENDER=:GENDER,
        @BIRTHDAY=:BIRTHDAY,
        @EMAIL=:EMAIL,
        @PHONENUMBER=:PHONENUMBER,
        @ADDRESS=:ADDRESS,
        @CREATEDUSER=:CREATEDUSER,
        @DEFAULTPICTUREURL=:DEFAULTPICTUREURL`;
  if (params.customer_id) {
    data["CUSTOMERID"] = params.customer_id;
    query += ",@CUSTOMERID=:CUSTOMERID";
  }
  if (params.password) {
    data["PASSWORD"] = stringHelper.hashPassword(params.password);
    query += ",@PASSWORD=:PASSWORD";
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
    if (params.customer_id === "-1") {
      if (transaction) {
        await transaction.rollback();
      }
      return null;
    }

    // commit
    await transaction.commit();
    return params.customer_id;
  } catch (err) {
    console.log("err.message", err.message);
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

const findByCustomerName = async (customerName) => {
  try {
    const customer = await database.sequelize.query(
      `${PROCEDURE_NAME.CUS_CUSTOMER_FINDBYCUSTOMERNAME} @CustomerName=:CustomerName`,
      {
        replacements: {
          CustomerName: customerName,
        },
        type: database.QueryTypes.SELECT,
      }
    );

    if (customer.length) {
      return CustomerClass.detail(customer[0]);
    }

    return null;
  } catch (error) {
    console.error("customerService.findByCustomerName", error);
    return null;
  }
};

// const findByCustomerName = async (customerName) => {
//   try {
//     const customer = await database.sequelize.query(
//       `${PROCEDURE_NAME.CUS_CUSTOMER_FINDBYCUSTOMERNAME} @CustomerName=:CustomerName`,
//       {
//         replacements: {
//           CustomerName: customerName,
//         },
//         type: database.QueryTypes.SELECT,
//       }
//     );

//     if (customer.length) {
//       return CustomerClass.detail(customer[0]);
//     }

//     return null;
//   } catch (error) {
//     console.error("customerService.findByCustomerName", error);
//     return null;
//   }
// };

const deleteCustomer = async (customerId, req) => {
  try {
    await database.sequelize.query(
      `${PROCEDURE_NAME.CUS_CUSTOMER_DELETE} @CUSTOMERID=:CUSTOMERID,@UPDATEDCUSTOMER=:UPDATEDCUSTOMER`,
      {
        replacements: {
          CUSTOMERID: customerId,
          UPDATEDUSER: apiHelper.getAuthId(req),
        },
        type: database.QueryTypes.UPDATE,
      }
    );
    removeCacheOptions();
    return true;
  } catch (error) {
    console.error("customerService.deleteCustomer", error);
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
      }
    );

    return true;
  } catch (error) {
    console.error("customerService.changePasswordCustomer", error);
    return false;
  }
};
const checkPassword = async (customerId) => {
  try {
    const data = await database.sequelize.query(
      `${PROCEDURE_NAME.CUS_CUSTOMER_CHECKPASSWORD} @CUSTOMERID=:CUSTOMERID`,
      {
        replacements: {
          CUSTOMERID: customerId,
        },
        type: database.QueryTypes.SELECT,
      }
    );
    return data[0].PASSWORD;
  } catch (error) {
    console.error("customerService.checkPassword", error);
    return "";
  }
};

const logCustomerLogin = async (data = {}) => {
  try {
    const pool = await mssql.pool;
    await pool
      .request()
      .input(
        "CUSTOMERPROFILEID",
        apiHelper.getValueFromObject(data, "customer_id")
      )
      .input(
        "CUSTOMERNAME",
        apiHelper.getValueFromObject(data, "customer_name")
      )
      .input(
        "CUSTOMERAGENT",
        apiHelper.getValueFromObject(data, "customer_agent")
      )
      .input("ISACTIVE", API_CONST.ISACTIVE.ACTIVE)
      .input(
        "CREATEDUSER",
        apiHelper.getValueFromObject(data, "customer_id")
      )
      .execute(PROCEDURE_NAME.CUS_CUSTOMER_LOGIN_LOG_CREATE);

    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      function: "customerService.logCustomerLogin",
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
      }
    );

    if (customer.length) {
      return CustomerClass.detail(customer[0]);
    }

    return null;
  } catch (error) {
    console.error("customerService.findByEmail", error);
    return null;
  }
};
const getOptionsAll = async (queryParams = {}) => {
  try {
    const ids = apiHelper.getValueFromObject(queryParams, "ids", []);
    const isActive = apiHelper.getFilterBoolean(queryParams, "is_active");
    const parentId = apiHelper.getValueFromObject(queryParams, "parent_id");
    const function_alias = apiHelper.getValueFromObject(
      queryParams,
      "function_alias"
    );
    const data = await cache.wrap(CACHE_CONST.CUS_CUSTOMER_OPTIONS, () => {
      return getOptions();
    });
    let dataCustomer = [];
    if (function_alias) {
      dataCustomer = await getByFunctionAlias(function_alias).filter((item) => {
        return item.CUSTOMERID;
      });
    }
    const idsFilter = ids.filter((item) => {
      return item;
    });
    const dataFilter = _.filter(data, (item) => {
      let isFilter = true;
      if (
        Number(isActive) !== API_CONST.ISACTIVE.ALL &&
        Boolean(Number(isActive)) !== item.ISACTIVE
      ) {
        isFilter = false;
      }
      if (idsFilter.length && !idsFilter.includes(item.CUSTOMERID.toString())) {
        isFilter = false;
      }
      if (parentId && Number(parentId) !== item.PARENTID) {
        isFilter = false;
      }
      if (
        function_alias &&
        !dataCustomer.includes(item.CUSTOMERID.toString())
      ) {
        isFilter = false;
      }
      if (isFilter) {
        return item;
      }
      return null;
    });

    return new ServiceResponse(true, "", CustomerClass.options(dataFilter));
  } catch (e) {
    logger.error(e, { function: "customerService.getOptionsAll" });

    return new ServiceResponse(true, "", []);
  }
};
const getOptions = async (req) => {
  try {
    const query = `${PROCEDURE_NAME.CUS_CUSTOMER_GETOPTIONS} 
      @IsActive=:IsActive`;
    const customers = await database.sequelize.query(query, {
      replacements: {
        IsActive: API_CONST.ISACTIVE.ALL,
      },
      type: database.QueryTypes.SELECT,
    });

    return customers;
  } catch (e) {
    logger.error(e, {
      function: "customerService.getOptions",
    });

    return [];
  }
};
const getByFunctionAlias = async (FunctionAlias) => {
  try {
    const query = `${PROCEDURE_NAME.CUS_CUSTOMER_GETBYFUNCTIONALIAS} 
      @FUNCTIONALIAS=:FUNCTIONALIAS`;
    const customers = await database.sequelize.query(query, {
      replacements: {
        FUNCTIONALIAS: FunctionAlias,
      },
      type: database.QueryTypes.SELECT,
    });

    return customers;
  } catch (e) {
    logger.error(e, {
      function: "customerService.getOptions",
    });

    return [];
  }
};
module.exports = {
  getListCustomer,
  createCustomer,
  detailCustomer,
  updateCustomer,
  deleteCustomer,
  checkPassword,
  changePasswordCustomer,
  findByCustomerName,
  logCustomerLogin,
  findByEmail,
  getOptionsAll,
};
