/**
 * Define project's actions#customer
 */
//
import {
  CUSTOMER_ADD,
  CUSTOMER_DEL,
  CUSTOMER_EDIT,
  CUSTOMER_SET,
  CUSTOMER_AUTH_SET,
} from "./constants";

//
import * as utils from "../utils";

/**
 *
 */
export function customerAdd(customer) {
  return { type: CUSTOMER_ADD, customer };
}

/**
 * Delete (remove) customer item
 * @param {String} id
 * @return {Object}
 */
export function customerDel(id) {
  return { type: CUSTOMER_DEL, id };
}

/**
 * Edit customer item
 * @param {String} id
 * @return {Object}
 */
export function customerEdit(id, customer) {
  return { type: CUSTOMER_EDIT, id, customer };
}

/**
 * Set customers
 * @param {Object} data
 * @return {Object}
 */
export function customerSet(data) {
  return { type: CUSTOMER_SET, data };
}

/**
 *
 * @param {Object|null} customer
 * @return {Object}
 */
export function customerAuthSet(customerAuth) {
  customerAuth = utils.isPlainObject(customerAuth, null);
  return { type: CUSTOMER_AUTH_SET, customerAuth };
}
