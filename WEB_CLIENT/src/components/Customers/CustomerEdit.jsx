import React, { PureComponent } from 'react';

// Component(s)
import Loading from '../Common/Loading';
import CustomerAdd from './CustomerAdd';

// Model(s)
import CustomerModel from "../../models/CustomerModel";

/**
 * @class CustomerEdit
 */
export default class CustomerEdit extends PureComponent {
  constructor(props) {
    super(props);

    // Init model(s)
    this._userModel = new CustomerModel();

    // Init state
    this.state = {
      /** @var {CustomerEntity} */
      userEnt: null
    };
  }

  componentDidMount() {
    // Fetch record data
    (async () => {
      let ID = this.props.match.params.id;
      let userEnt = await this._userModel.read(ID)
        .catch(() => {
          setTimeout(() => window._$g.rdr('/404'));
        })
      ;
      userEnt && this.setState({ userEnt });
    })();
    //.end
  }

  render() {
    let {
      userEnt,
    } = this.state;

    // Ready?
    if (!userEnt) {
      return <Loading />;
    }

    return <CustomerAdd userEnt={userEnt} {...this.props} />
  }
}
