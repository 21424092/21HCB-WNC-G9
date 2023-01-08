import React, { PureComponent } from "react";

// Component(s)
import Loading from "../Common/Loading";
import AccountReceiveAdd from "./AccountReceiveAdd";

// Model(s)
import AccountReceiveModel from "../../models/AccountReceiveModel";

/** @var {Object} */
const userAuth = window._$g.userAuth;

/**
 * @class AccountReceiveEdit
 */
export default class AccountReceiveEdit extends PureComponent {
  constructor(props) {
    super(props);

    // Init model(s)
    this._accountReceiveModel = new AccountReceiveModel();

    // Init state
    this.state = {
      /** @var {AccountReceiveEntity} */
      accountReceiveEnt: null,
    };
  }

  componentDidMount() {
    // Fetch record data
    (async () => {
      let ID = this.props.match.params.id;
      let accountReceiveEnt = await this._accountReceiveModel.read(ID).catch(() => {
        setTimeout(() => window._$g.rdr("/404"));
      });
      accountReceiveEnt && this.setState({ accountReceiveEnt });
    })();
    //.end
  }

  render() {
    let { accountReceiveEnt } = this.state;
    let { noEdit } = this.props;

    // Ready?
    if (!accountReceiveEnt) {
      return <Loading />;
    }

    return (
      <AccountReceiveAdd
        accountReceiveEnt={accountReceiveEnt}
        noEdit={noEdit || userAuth._isAdministrator()}
        {...this.props}
      />
    );
  }
}
