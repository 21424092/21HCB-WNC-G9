/**
 *
 */
import {
  CUSTOMER_ADD,
  CUSTOMER_DEL,
  CUSTOMER_EDIT,
  CUSTOMER_SET,
  CUSTOMER_AUTH_SET,
} from "../actions/constants";

let defaultData = []; 
export function customerAuth(state = null, action) {
  switch (action.type) {
    // CUSTOMER_AUTH_SET
    case CUSTOMER_AUTH_SET:
      state = action.customerAuth;
      break;
    default:
  }
  return state;
}

export function customers(state = defaultData, action) {
  // state = (state instanceof Array) ? state : defaultData; // set default value
  switch (action.type) {
    // CUSTOMER_ADD
    case CUSTOMER_ADD:
      state = state.concat([action.customer]);
      break; // #end
    // CUSTOMER_DEL
    case CUSTOMER_DEL:
      {
        let foundUserIdx = state.findIndex(
          (customer) => customer.id === action.id
        );
        if (foundUserIdx >= 0) {
          state = state.splice(foundUserIdx, 1);
        }
      }
      break; // #end
    // CUSTOMER_EDIT
    case CUSTOMER_EDIT:
      alert("CUSTOMER_EDIT has not yet implemented");
      break; // #end
    // CUSTOMER_SET
    case CUSTOMER_SET:
      state = defaultData.concat([]);
      break; // #end
    default:
  }
  return state;
}
