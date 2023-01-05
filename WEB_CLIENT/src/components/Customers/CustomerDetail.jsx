import React, { PureComponent } from 'react';

// Component(s)
import CustomerEdit from './CustomerEdit';

/**
 * @class CustomerDetail
 */
export default class CustomerDetail extends PureComponent {
  render() {
    return <CustomerEdit {...this.props} noEdit={true} />
  }
}
