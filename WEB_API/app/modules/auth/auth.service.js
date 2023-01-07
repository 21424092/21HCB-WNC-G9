const moment = require("moment");
const jwt = require("jsonwebtoken");
const uuid = require("uuid/v1");
const config = require("../../../config/config");
const database = require("../../models");
const UserClass = require("../user/user.class");
const CustomerClass = require("../customer/customer.class");
const RESPONSE_MSG = require("../../common/const/responseMsg.const");
const PROCEDURE_NAME = require("../../common/const/procedureName.const");
const userService = require("../user/user.service");
const customerService = require("../customer/customer.service");

const TOKEN_EXPIRE_AFTER = 3600; // expires in 1 hour
const REFRESH_TOKEN_EXPIRE_AFTER = 86400; // expires in 24 hours

const getUserByUsername = async (user_name) => {
  try {
    const users = await database.sequelize.query(
      `${PROCEDURE_NAME.SYS_USER_FINDBYUSERNAME} @USERNAME=:USERNAME`,
      {
        replacements: {
          USERNAME: user_name,
        },
        type: database.QueryTypes.SELECT,
      }
    );
    return users && UserClass.basicInfo(users[0]);
  } catch (error) {
    console.error("authService.getUserByUsername", error);
    return null;
  }
};

const generateToken = async (user) => {
  try {
    const data = {
      token_id: uuid(),
      user_id: user.user_id,
      user_name: user.user_name,
    };
    // Get information of user
    const userDetail = await userService.detailUser(user.user_id);
    if (userDetail) {
      data.user_groups = userDetail.user_groups;
    }
    if (user.user_name === config.adminUserName) {
      data.isAdministrator = 1;
    }

    const token = jwt.sign(data, config.hashSecretKey, {
      expiresIn: TOKEN_EXPIRE_AFTER,
    });
    const refreshToken = jwt.sign(data, config.hashSecretKey, {
      expiresIn: REFRESH_TOKEN_EXPIRE_AFTER,
    });
    // Store token id to DB

    //
    return {
      tokenKey: config.token.key,
      tokenType: config.token.type,
      accessToken: token,
      tokenExpireAt: moment()
        .add(TOKEN_EXPIRE_AFTER, "s")
        .seconds(0)
        .utc()
        .valueOf(),
      refreshToken: refreshToken,
      refreshTokenExpireAt: moment()
        .add(REFRESH_TOKEN_EXPIRE_AFTER, "s")
        .seconds(0)
        .utc()
        .valueOf(),
    };
  } catch (error) {
    console.error("authService.generateToken", error);
    return null;
  }
};

const refreshToken = async (refreshToken) => {
  try {
    // Verify token
    return jwt.verify(
      refreshToken,
      config.hashSecretKey,
      async (err, decoded) => {
        if (err) {
          throw err;
        }
        // Get user
        const user = await getUserByUsername(decoded.user_name);
        if (!user) {
          throw RESPONSE_MSG.NOT_FOUND;
        }
        return await generateToken(user);
      }
    );
  } catch (error) {
    console.error("authService.refreshToken", error);
    return null;
  }
};

const generateBankToken = async (model) => {
  try {
    const data = {
      clientid: model.clientid,
      clientsecret: model.clientsecret,
    };
    // Get information of user
    const bankDetail = await userService.detailBankConnect(data.clientid);
    const token = jwt.sign(bankDetail, config.hashSecretKey, {
      expiresIn: TOKEN_EXPIRE_AFTER,
    });
    const refreshToken = jwt.sign(bankDetail, config.hashSecretKey, {
      expiresIn: REFRESH_TOKEN_EXPIRE_AFTER,
    });
    // Store token id to DB
    //
    return {
      tokenKey: config.token.key,
      tokenType: config.token.type,
      accessToken: token,
      tokenExpireAt: moment()
        .add(TOKEN_EXPIRE_AFTER, "s")
        .seconds(0)
        .utc()
        .valueOf(),
      refreshToken: refreshToken,
      refreshTokenExpireAt: moment()
        .add(REFRESH_TOKEN_EXPIRE_AFTER, "s")
        .seconds(0)
        .utc()
        .valueOf(),
    };
  } catch (error) {
    console.error("authService.generateToken", error);
    return null;
  }
};

const refreshBankToken = async (refreshToken) => {
  try {
    // Verify token
    return jwt.verify(
      refreshToken,
      config.hashSecretKey,
      async (err, decoded) => {
        if (err) {
          throw err;
        }
        // Get user
        const bankDetail = await userService.detailBankConnect(decoded.id);
        if (!bankDetail) {
          throw RESPONSE_MSG.NOT_FOUND;
        }
        return await generateBankToken({
          clientid: bankDetail.id,
          clientsecret: bankDetail.secret,
        });
      }
    );
  } catch (error) {
    console.error("authService.refreshToken", error);
    return null;
  }
};

const getUserByCustomername = async (user_name) => {
  try {
    const users = await database.sequelize.query(
      `${PROCEDURE_NAME.CUS_CUSTOMER_FINDBYUSERNAME} @USERNAME=:USERNAME`,
      {
        replacements: {
          USERNAME: user_name,
        },
        type: database.QueryTypes.SELECT,
      }
    );
    return users && CustomerClass.basicInfo(users[0]);
  } catch (error) {
    console.error("authService.getUserByUsername", error);
    return null;
  }
};

const generateCustomerToken = async (customer) => {
  try {
    const data = {
      token_id: uuid(),
      customer_id: customer.customer_id,
      user_name: customer.user_name,
      type: "customer_banking",
    };
    const token = jwt.sign(data, config.hashSecretKey, {
      expiresIn: TOKEN_EXPIRE_AFTER,
    });
    const refreshToken = jwt.sign(data, config.hashSecretKey, {
      expiresIn: REFRESH_TOKEN_EXPIRE_AFTER,
    });
    // Store token id to DB

    //
    return {
      tokenKey: config.token.key,
      tokenType: config.token.type,
      accessToken: token,
      tokenExpireAt: moment()
        .add(TOKEN_EXPIRE_AFTER, "s")
        .seconds(0)
        .utc()
        .valueOf(),
      refreshToken: refreshToken,
      refreshTokenExpireAt: moment()
        .add(REFRESH_TOKEN_EXPIRE_AFTER, "s")
        .seconds(0)
        .utc()
        .valueOf(),
    };
  } catch (error) {
    console.error("authService.generateToken", error);
    return null;
  }
};

const refreshCustomerToken = async (refreshToken) => {
  try {
    // Verify token
    return jwt.verify(
      refreshToken,
      config.hashSecretKey,
      async (err, decoded) => {
        if (err) {
          throw err;
        }
        // Get user
        const customer = await getUserByCustomername(decoded.user_name);
        if (!customer) {
          throw RESPONSE_MSG.NOT_FOUND;
        }
        return await generateCustomerToken(customer);
      }
    );
  } catch (error) {
    console.error("authService.refreshToken", error);
    return null;
  }
};
module.exports = {
  getUserByUsername,
  generateToken,
  refreshToken,
  generateBankToken,
  refreshBankToken,
  getUserByCustomername,
  generateCustomerToken,
  refreshCustomerToken,
};
