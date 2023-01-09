//
import Model from "../Model";
//
import DebitEntity from "../DebitEntity";
// Util(s)
// import { jqxGridColumns } from '../../utils/jqwidgets';

/**
 * @class DebitModel
 */
export default class DebitModel extends Model {
  /** @var {String} redux store::state key */
  _stateKeyName = "debit";

  /** @var {Ref} */
  _entity = DebitEntity;

  /** @var {String} */
  static API_DEBIT_LIST = "debit";
  /** @var {String} */
  static API_DEBIT_OPTS = "debit/get-options";
  /** @var {String} */
  static API_DEBIT_ACCOUNT = "debit/get-account/:customer_number";
  /** @var {String} */
  static API_DEBIT_CREATE = "debit";
  /** @var {String} */
  static API_DEBIT_UPDATE = "debit/:id"; // PUT
  /** @var {String} */
  static API_DEBIT_READ = "debit/:id"; // GET
  /** @var {String} */
  static API_DEBIT_DELETE = "debit/:id"; // DELETE
  /** @var {String} */
  static API_DEBIT_CHANGE_STATUS = "debit/:id/status";
  /** @var {String} */
  static API_DEBIT_CANCELDEBIT = "debit/cancel-debit"; // DELETEdonedebit
  /** @var {String} */
  static API_DEBIT_DONEDEBIT = "debit/done-debit";
  /** @var {String} */
  static API_DEBIT_SEND_OTP = "debit/send-otp/:customerDebitId"; // DELETE
  /**
   * @var {String} Primary Key
   */
  primaryKey = "customer_account_receive_id";

  /**
   * @return {Object}
   */
  fillable = () => ({
    customer_debit_id: 0,
    account_id: 0,
    account_number: "",
    account_holder: "",
    current_debit: 0,
    content_debit: "",
    debit_status: "",
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
    return this._api.get(_static.API_DEBIT_LIST, opts);
  }

  /**
   * Get options (list opiton)
   * @param {Object} _opts
   * @returns Promise
   */
  getAccount(customer_number) {
    return this._api.get(
      _static.API_DEBIT_ACCOUNT.replace(":customer_number", customer_number)
    );
  }
  /**
   * Get options (list opiton)
   * @param {Object} _opts
   * @returns Promise
   */
  sendOTP(customerDebitId) {
    return this._api.get(
      _static.API_DEBIT_SEND_OTP.replace(":customerDebitId", customerDebitId)
    );
  }

  /**
   * @return {Promise}
   */
  create(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, this.fillable(), _data);
    //
    return this._api.post(_static.API_DEBIT_CREATE, data);
  }

  /**
   * @return {Promise}
   */
  canceldebit(data = {}) {
    return this._api.post(_static.API_DEBIT_CANCELDEBIT, data);
  }

  /**
   * @return {Promise}
   */
  donedebit(data = {}) {
    return this._api.post(_static.API_DEBIT_DONEDEBIT, data);
  }

  /**
   * @return {Promise}
   */
  read(id, _data = {}) {
    // Validate data?!
    //
    return this._api
      .get(_static.API_DEBIT_READ.replace(":id", id))
      .then((res) => {
        console.log(res);
        return new DebitEntity(res);
      });
  }

  /**
   * @return {Promise}
   */
  update(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.put(_static.API_DEBIT_UPDATE.replace(":id", id), data);
  }
  /**
   * @return {Promise}
   */
  changeStatus(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.put(
      _static.API_DEBIT_CHANGE_STATUS.replace(":id", id),
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
    return this._api.delete(_static.API_DEBIT_DELETE.replace(":id", id), data);
  }
}
// Make alias
const _static = DebitModel;
