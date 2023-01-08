import React, { PureComponent } from 'react';

// Component(s)
import AccountReceiveEdit from './AccountReceiveEdit';

/**
 * @class AccountReceiveDetail
 */
export default class AccountReceiveDetail extends PureComponent {
  render() {
    return <AccountReceiveEdit {...this.props} noEdit={true} />
  }
}
