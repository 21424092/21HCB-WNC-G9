import Model from "../Model";
import CustomerEntity from "../CustomerEntity";
import { customerAuthSet } from "../../actions/customer";
import moment from "moment";
import crypto from "crypto";
export default class CustomerModel extends Model {
  _stateKeyName = "customers";
  _entity = CustomerEntity;

  static API_CUS_LIST = "customer";
  static API_CUS_LIST_ACCOUNT = "customer/list-account";
  static API_CUS_OPTS = "customer/get-options";
  static API_CUS_INIT = "customer/create";
  static API_CUS_CREATE = "customer";
  static API_CUS_CREATEACCOUNT = "customer/create-account";
  static API_CUS_ACCOUNT_OPTS = "customer/opts-customer-account/:id";
  static API_CUS_ACCOUNT_UPDATEPAID = "customer/update-paid-account";
  static API_CUS_AUTH = "auth/customer-access-token";
  static API_CUSTOMER_PROFILE = "auth/get-profile-customer";

  primaryKey = "customer_id";
  static columnPrefix = "";
  fillable = () => ({
    user_name: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
    gender: "0",
    birthday: "",
    email: "",
    phone_number: "",
    address: "",
  });
  static buildAuthHeader() {
    let auth = _static.getCustomerAuthStatic();
    return {
      name: auth ? auth.tokenKey : null,
      value: auth ? `${auth.tokenType} ${auth.accessToken}` : null,
    };
  }

  /**
   * Get current authed customer
   * @returns CustomerEntity|null
   */
  getCustomerAuth() {
    let customerAuth = this._store.getState()["customerAuth"];
    return customerAuth && new CustomerEntity(customerAuth);
  }

  /**
   * Get current authed customer static
   * @returns CustomerEntity|null
   */
  static getCustomerAuthStatic() {
    let customerAuth = _static._storeStatic.getState()["customerAuth"];
    return customerAuth && new CustomerEntity(customerAuth);
  }

  /**
   *
   */
  static getPrefsStatic(key) {
    let prefs = {};
    let customerAuth =
      window._$g.customerAuth || _static.getCustomerAuthStatic();
    if (customerAuth) {
      prefs = customerAuth._prefs || {};
    }
    return key ? prefs[key] : prefs;
  }

  /**
   *
   */
  static addPrefStatic(key, value) {
    let customerAuth =
      window._$g.customerAuth || _static.getCustomerAuthStatic();
    if (customerAuth) {
      let prefs = customerAuth._prefs || {};
      prefs[key] = value;
      customerAuth._prefs = prefs;
      _static.storeCustomerAuthStatic(customerAuth);
    }
  }

  /**
   *
   */
  static setPrefStatic(prefs) {
    let customerAuth =
      window._$g.customerAuth || _static.getCustomerAuthStatic();
    if (customerAuth) {
      customerAuth._prefs = prefs || {};
      _static.storeCustomerAuthStatic(customerAuth);
    }
  }

  /**
   * Store auth customer
   * @param {Object} data
   */
  static storeCustomerAuthStatic(data) {
    let customerAuth = _static.getCustomerAuthStatic();
    let authData = Object.assign(customerAuth || {}, data);
    // let ent = new CustomerEntity(authData);
    _static._storeStatic.dispatch(customerAuthSet(authData));
    return data;
  }

  login(user_name, password, gg_token) {
    return this._api
      .post(_static.API_CUS_AUTH, {
        user_name: user_name,
        password,
        gg_token: gg_token,
      })
      .then(
        (loginData) =>
          _static.storeCustomerAuthStatic(loginData) &&
          this._api.get(_static.API_CUSTOMER_PROFILE).then((profileData) => {
            _static.storeCustomerAuthStatic(
              Object.assign(profileData, {
                _prefs: {}, // Self init customer's preferences,...
              })
            );
            return profileData;
          })
      );
  }

  /**
   * Logout
   * @param {Object} data
   * @return Promise
   */
  logout(data) {
    return new Promise((resolve) => {
      return this._api
        .post(_static.API_CUSTOMER_LOGOUT, data || {})
        .then(
          () => {},
          (err) => {}
        ) // try/catch all
        .finally((data) => {
          // Clear auth customer
          this._store.dispatch(customerAuthSet(null));
          // Return, chain promise call
          return resolve(data || { data: true });
        });
    });
  }

  list(_opts = {}) {
    let opts = Object.assign({}, _opts);
    return this._api.get(_static.API_CUS_LIST, opts);
  }

  listTaiKhoan(_opts = {}) {
    let opts = Object.assign({}, _opts);
    return this._api.get(_static.API_CUS_LIST_ACCOUNT, opts);
  }

  create(data = {}) {
    return this._api.post(_static.API_CUS_CREATE, data);
  }
  createAccount(data = {}) {
    return this._api.post(_static.API_CUS_CREATEACCOUNT, data);
  }
  updatePaidAccount(data = {}) {
    return this._api.post(_static.API_CUS_ACCOUNT_UPDATEPAID, data);
  }
  getOptions(id) {
    return this._api.get(_static.API_CUS_ACCOUNT_OPTS.replace(":id", id));
  }
}
// Make alias
const _static = (window._globModelCustomer = CustomerModel);

// Add events
_static._apiStatic
  .addEventListener("beforeRequest", (event) => {
    let {
      args: { config },
    } = event;
    // Inject 'header'
    let { headers = {}, url } = config;

    // +++ auth token data
    let { name: hAuthName, value: hAuthValue } = _static.buildAuthHeader();
    if (hAuthName && hAuthValue) {
      headers[hAuthName] = hAuthValue;
    }
    let secret_key = process.env.REACT_APP_SECRET_KEY;
    let secret_time = moment().format("YYYYMMDDHHmmss");
    headers["x-secret-time"] = secret_time;
    headers["x-secret-key"] = crypto
      .createHash("sha256")
      .update("/api/" + url + secret_time + secret_key)
      .digest("hex");
    Object.assign(config, { headers });
    //.end*/
    // console.log('beforeRequest: ', config);
  })
  .addEventListener("request", (event) => {
    let {
      args: { /* config, */ incomming },
    } = event;
    //
    incomming.then((apiData) => {
      // console.log('request: ', apiData);
      delete apiData._;
      // chain call
      return apiData;
    });
  })
  .addEventListener("beforeRefreshToken", (event) => {
    let { args: authData } = event;
    let customerAuth = _static.getCustomerAuthStatic();
    Object.assign(authData, customerAuth);
  })
  .addEventListener("afterRefreshToken", (event) => {
    let { args: authData } = event;
    _static.storeCustomerAuthStatic(authData);
  });
