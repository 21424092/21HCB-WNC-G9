const RESPONSE_MSG = require("../common/const/responseMsg.const");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const crypto = require("crypto");
const httpStatus = require("http-status");
const config = require("../../config/config");

const ErrorResponse = require("../common/responses/error.response");
const prefix = "/api";
const ROUTE_NOT_CHECK = [
  `${prefix}/api-docs`,
  `${prefix}`,
  `${prefix}/auth/token`,
  `${prefix}/auth/refresh-token`,
  `${prefix}/auth/logout`,
  `${prefix}/auth/bank-access-token`,
  `${prefix}/auth/bank-refresh-token`,
];

const REGEX_ROUTE_NOT_CHECK = [
  "/api\\/swagger*.", // eslint-disable-line no-useless-escape
];

module.exports = async (req, res, next) => {
  const path = req.path;
  // Exclude routes don't need check
  if (ROUTE_NOT_CHECK.includes(path)) {
    return next();
  }

  // Exclude regex routes don't need check
  for (let i = 0; i < REGEX_ROUTE_NOT_CHECK.length; i++) {
    const pattern = new RegExp(REGEX_ROUTE_NOT_CHECK[i]);
    if (pattern.test(path)) {
      return next();
    }
  }
  const encodedToken = (req_url, time, token) => {
    const url = req_url;
    const secret_key = config.hashSecretKey;

    const hash = crypto
      .createHash("sha256")
      .update(url + time + secret_key)
      .digest("hex");

    return hash === token;
  };
  const secret_url = req.originalUrl;
  const secret_time = req.headers["x-secret-time"];
  const secret_token = req.headers["x-secret-key"];
  if (!secret_token) {
    return next(
      new ErrorResponse(
        httpStatus.BAD_REQUEST,
        null,
        RESPONSE_MSG.AUTH.LOGIN.TIME_OUT
      )
    );
  }

  if (Date.now() - moment(secret_time, "YYYYMMDDHHmmss").toDate() > 90000000) {
    //token có hiệu lực trong 90s
    return next(
      new ErrorResponse(
        httpStatus.BAD_REQUEST,
        null,
        RESPONSE_MSG.AUTH.LOGIN.TIME_OUT
      )
    );
  }

  // console.log(
  //   "!encodedToken(secret_url, secret_time, secret_token)",
  //   !encodedToken(secret_url, secret_time, secret_token)
  // );
  // if (!encodedToken(secret_url, secret_time, secret_token)) {
  //   return next(
  //     new ErrorResponse(
  //       httpStatus.BAD_REQUEST,
  //       null,
  //       RESPONSE_MSG.AUTH.LOGIN.TIME_OUT
  //     )
  //   );
  // }
  // Get authorization header
  const authorization = req.headers["authorization"];
  if (authorization && /^Bearer /.test(authorization)) {
    // Remove Bearer from string
    const token = authorization.replace("Bearer ", "");
    try {
      const decoded = jwt.verify(token, config.hashSecretKey);
      // set information user to request.auth
      if (decoded.type !== "bank_linking") {
        req.auth = decoded;
        req.body.auth_id = decoded.user_id;
        req.body.auth_name = decoded.user_name;
      } else {
        req.bankInfo = decoded;
        req.body.bankid = decoded.id;
      }
      return next();
    } catch (e) {
      return next(new ErrorResponse(httpStatus.UNAUTHORIZED, null, e.message));
    }
  }

  return next(
    new ErrorResponse(
      httpStatus.UNAUTHORIZED,
      "",
      RESPONSE_MSG.AUTH.LOGIN.TOKEN_REQUIRED
    )
  );
};
