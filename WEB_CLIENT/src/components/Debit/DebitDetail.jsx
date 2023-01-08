import React, { PureComponent } from "react";

// Component(s)
import DebitEdit from "./DebitEdit";

/**
 * @class DebitDetail
 */
export default class DebitDetail extends PureComponent {
  render() {
    return <DebitEdit {...this.props} noEdit={true} />;
  }
}
