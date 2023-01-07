//
import Model from "../Model";
//
import CustomerEntity from "../CustomerEntity";

import {
  // userAdd,
  userAuthSet,
} from "../../actions/user";

/**
 * @class CustomerModel
 */
export default class CustomerModel extends Model {
  /** @var {String} redux store::state key */
  _stateKeyName = "customers";

  /** @var {Ref} */
  _entity = CustomerEntity;

  /** @var {String} */
  static API_CUS_LIST = "customer";
  /** @var {String} */
  static API_CUS_OPTS = "customer/get-options";
  /** @var {String} */
  static API_CUS_INIT = "customer/create";
  /** @var {String} */
  static API_CUS_CREATE = "customer";
  /** @var {String} */
  static API_CUS_UPDATE = "customer/:id"; // PUT
  /** @var {String} */
  static API_CUS_READ = "customer/:id"; // GET
  /** @var {String} */
  static API_CUS_DELETE = "customer/:id"; // DELETE
  /** @var {String} */
  static API_CUS_CHANGE_PASSWORD = "customer/:id/change-password"; // PUT
  /** @var {String} */
  static API_CHANGE_PASSWORD_USER = "customer/:id/change-password-customer"; // PUT
  /** @var {String} */
  static API_CUS_FUNCTIONS = "function/functions-by-customer-group"; // GET

  /**
   * @var {String} Primary Key
   */
  primaryKey = "customer_id";

  /**
   * Column datafield prefix
   * @var {String}
   */
  static columnPrefix = "";

  /**
   * @return {Object}
   */
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

  /**
   * @return {Object}
   */
  static buildAuthHeader() {
    let auth = _static.getUserAuthStatic();
    return {
      name: auth ? auth.tokenKey : null,
      value: auth ? `${auth.tokenType} ${auth.accessToken}` : null,
    };
  }

  /**
   * Get current authed user
   * @returns CustomerEntity|null
   */
  getUserAuth() {
    let userAuth = this._store.getState()["userAuth"];
    return userAuth && new CustomerEntity(userAuth);
  }

  /**
   * Get current authed user static
   * @returns CustomerEntity|null
   */
  static getUserAuthStatic() {
    let userAuth = _static._storeStatic.getState()["userAuth"];
    return userAuth && new CustomerEntity(userAuth);
  }

  /**
   *
   */
  static getPrefsStatic(key) {
    let prefs = {};
    let userAuth = window._$g.userAuth || _static.getUserAuthStatic();
    if (userAuth) {
      prefs = userAuth._prefs || {};
    }
    return key ? prefs[key] : prefs;
  }

  /**
   *
   */
  static addPrefStatic(key, value) {
    let userAuth = window._$g.userAuth || _static.getUserAuthStatic();
    if (userAuth) {
      let prefs = userAuth._prefs || {};
      prefs[key] = value;
      userAuth._prefs = prefs;
      _static.storeUserAuthStatic(userAuth);
    }
  }

  /**
   *
   */
  static setPrefStatic(prefs) {
    let userAuth = window._$g.userAuth || _static.getUserAuthStatic();
    if (userAuth) {
      userAuth._prefs = prefs || {};
      _static.storeUserAuthStatic(userAuth);
    }
  }

  /**
   * Store auth user
   * @param {Object} data
   */
  static storeUserAuthStatic(data) {
    let userAuth = _static.getUserAuthStatic();
    let authData = Object.assign(userAuth || {}, data);
    // let ent = new CustomerEntity(authData);
    _static._storeStatic.dispatch(userAuthSet(authData));
    return data;
  }

  /**
   * Login
   * @param {String} user_name
   * @param {String} password
   * @param {Boolean} remember
   * @return Promise
   */
  login(user_name, password, remember) {
    return this._api
      .post(_static.API_USER_AUTH, {
        user_name: user_name,
        password,
        remember,
      })
      .then(
        (loginData) =>
          _static.storeUserAuthStatic(loginData) &&
          this._api.get(_static.API_USER_PROFILE).then((profileData) => {
            _static.storeUserAuthStatic(
              Object.assign(profileData, {
                _prefs: {}, // Self init user's preferences,...
              })
            );
            if (!profileData.isAdministrator) {
              return this._api
                .get(_static.API_USER_FUNCTIONS)
                .then((_functions) =>
                  _static.storeUserAuthStatic({ _functions })
                );
            }
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
        .post(_static.API_USER_LOGOUT, data || {})
        .then(
          () => {},
          (err) => {}
        ) // try/catch all
        .finally((data) => {
          // Clear auth user
          this._store.dispatch(userAuthSet(null));
          // Return, chain promise call
          return resolve(data || { data: true });
        });
    });
  }

  /**
   *
   * @param {object} data
   */
  // constructor(data) { super(data); }

  dataList(_opts = {}) {
    // Get, format input(s)
    let opts = Object.assign({}, _opts);

    return new Promise((resolve) => {
      // Fetch data
      let dataList = super.dataList([], opts);
      // +++ Include 'Favorites'?

      // Filter?
      let { filters = {} } = opts;
      // ---
      if (Object.keys(filters).length) {
        dataList = dataList.filter((item, idx) => {
          let rtn = true;
          // Filter by: fullname or tel?
          if (filters.fullname_or_tel) {
            rtn = false;
            let fnOrTelLC = filters.fullname_or_tel.toString().toLowerCase();
            let fnLC = item.fullname().toString().toLowerCase();
            let telLC = item.tel.toString().toLowerCase();
            if (fnLC.indexOf(fnOrTelLC) >= 0 || telLC.indexOf(fnOrTelLC) >= 0) {
              rtn = true;
            }
          }
          return rtn;
        });
      }
      //.end

      // Return
      setTimeout(() => {
        resolve(dataList);
      }, 1e3);
    });
  }

  findOne(_opts = {}) {
    // Fetch data
    let dataList = this.dataList(_opts);

    // Filters
    return dataList[0] || null;
  }

  /**
   * Get list
   * @returns Promise
   */
  list(_opts = {}) {
    let opts = Object.assign(
      {
        // itemsPerPage:,
        // page,
        // is_active
        // is_system
      },
      _opts
    );
    return this._api.get(_static.API_CUS_LIST, opts);
  }

  /**
   * @return {Promise}
   */
  init(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    // console.log('Customer#init: ', data);
    //
    return this._api.post(_static.API_CUS_INIT, data);
  }

  /**
   * Get options (list opiton)
   * @param {Object} _opts Options
   * @returns Promise
   */
  getOptions(_opts = {}) {
    let opts = Object.assign({}, _opts);
    return this._api.get(_static.API_CUS_OPTS, opts);
  }

  /**
   * Get options full
   * @param {Object} _opts Options
   * @returns Promise
   */
  getOptionsFull(_opts = {}) {
    let apiOpts = Object.assign(
      {
        itemsPerPage: _static._MAX_ITEMS_PER_PAGE,
      },
      _opts
    );
    let opts = Object.assign({}, apiOpts["_opts"]);
    delete apiOpts["_opts"];

    return this.list(apiOpts).then(({ items }) => {
      return opts["raw"]
        ? items
        : items.map(({ full_name: name, customer_id: id, user_name }) => ({
            name,
            id,
            user_name,
          }));
    });
  }

  /**
   * @return {Promise}
   */
  create(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, this.fillable(), _data);
    return this._api.post(_static.API_CUS_CREATE, data);
  }

  /**
   * @return {Promise}
   */
  read(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api
      .get(_static.API_CUS_READ.replace(":id", id), data)
      .then((data) => new CustomerEntity(data));
  }

  /**
   * @return {Promise}
   */
  update(id, _data = {}) {
    let data = Object.assign({}, _data);
    return this._api.put(_static.API_CUS_UPDATE.replace(":id", id), data);
  }

  /**
   * @return {Promise}
   */
  delete(id, _data = {}) {
    let data = Object.assign({}, _data);
    return this._api.delete(_static.API_CUS_DELETE.replace(":id", id), data);
  }

  /**
   * @return {Promise}
   */
  changePassword(id, _data = {}) {
    let data = Object.assign({}, _data);
    //
    return this._api.put(
      _static.API_CUS_CHANGE_PASSWORD.replace(":id", id),
      data
    );
  }

  /**
   * @return {Promise}
   */
  changePasswordCustomer(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.put(
      _static.API_CHANGE_PASSWORD_USER.replace(":id", id),
      data
    );
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
    let { headers = {} } = config;

    // +++ auth token data
    let { name: hAuthName, value: hAuthValue } = _static.buildAuthHeader();

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
