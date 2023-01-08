//
import Model from "../Model";
//
import AccountReceiveEntity from "../AccountReceiveEntity";
// Util(s)
// import { jqxGridColumns } from '../../utils/jqwidgets';

/**
 * @class AccountReceiveModel
 */
export default class AccountReceiveModel extends Model {
  /** @var {String} redux store::state key */
  _stateKeyName = "account_receive";

  /** @var {Ref} */
  _entity = AccountReceiveEntity;

  /** @var {String} */
  static API_ACCOUNT_RECEIVE_LIST = "account-receive";
  /** @var {String} */
  static API_ACCOUNT_RECEIVE_OPTS = "account-receive/get-options";
  /** @var {String} */
  static API_ACCOUNT_RECEIVE_LISTBANK = "account-receive/get-list-bank";
  /** @var {String} */
  static API_ACCOUNT_RECEIVE_CREATE = "account-receive";
  /** @var {String} */
  static API_ACCOUNT_RECEIVE_UPDATE = "account-receive/:id"; // PUT
  /** @var {String} */
  static API_ACCOUNT_RECEIVE_READ = "account-receive/:id"; // GET
  /** @var {String} */
  static API_ACCOUNT_RECEIVE_DELETE = "account-receive/:id"; // DELETE
  /** @var {String} */
  static API_ACCOUNT_RECEIVE_CHANGE_STATUS = "/account-receive/:id/status";
  /**
   * @var {String} Primary Key
   */
  primaryKey = "customer_account_receive_id";

  /**
   * @return {Object}
   */
  fillable = () => ({
    customer_account_receive_id: 0,
    account_number: "",
    account_holder: "",
    nickname: "",
    bank_id: 0,
    is_active: false,
  });

  /**
   * Get list
   * @returns Promise
   */
  list(_opts = {}) {
    let opts = Object.assign(
      {
        //itemsPerPage: 25,
        //page: 1,
        //is_active: 2,
        //is_system: 2
      },
      _opts
    );
    return this._api.get(_static.API_ACCOUNT_RECEIVE_LIST, opts);
  }

  /**
   * Get options (list opiton)
   * @param {Object} _opts
   * @returns Promise
   */
  getListBank(_opts) {
    let opts = Object.assign(
      {
        is_active: 1,
      },
      _opts
    );
    //
    return this._api.get(_static.API_ACCOUNT_RECEIVE_LISTBANK, opts);
  }

  /**
   * @return {Promise}
   */
  create(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, this.fillable(), _data);
    //
    return this._api.post(_static.API_ACCOUNT_RECEIVE_CREATE, data);
  }

  /**
   * @return {Promise}
   */
  read(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api
      .get(_static.API_ACCOUNT_RECEIVE_READ.replace(":id", id), data)
      .then((data) => new AccountReceiveEntity(data));
  }

  /**
   * @return {Promise}
   */
  update(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.put(
      _static.API_ACCOUNT_RECEIVE_UPDATE.replace(":id", id),
      data
    );
  }
  /**
   * @return {Promise}
   */
  changeStatus(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.put(
      _static.API_ACCOUNT_RECEIVE_CHANGE_STATUS.replace(":id", id),
      data
    );
  }

  /**
   * @return {Promise}
   */
  delete(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.delete(
      _static.API_ACCOUNT_RECEIVE_DELETE.replace(":id", id),
      data
    );
  }
}
// Make alias
const _static = AccountReceiveModel;
