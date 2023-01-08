/**
 * Project's reducers
 */
import { combineReducers } from 'redux';
//
import * as common from './common';
import * as users from './users';
import * as customers from "./customers";

// export default
const reducers = combineReducers({
  ...common,
  ...users,
  ...customers,
});
export default reducers;
