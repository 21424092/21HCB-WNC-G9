import React, { PureComponent } from "react";

// Component(s)
import Loading from "../Common/Loading";
import DebitAdd from "./DebitAdd";

// Model(s)
import DebitModel from "../../models/DebitModel";

/** @var {Object} */
const userAuth = window._$g.userAuth;

/**
 * @class DebitEdit
 */
export default class DebitEdit extends PureComponent {
  constructor(props) {
    super(props);

    // Init model(s)
    this._debitModel = new DebitModel();

    // Init state
    this.state = {
      /** @var {DebitEntity} */
      debitEnt: null,
    };
  }

  componentDidMount() {
    // Fetch record data
    (async () => {
      let ID = this.props.match.params.id;
      let debitEnt = await this._debitModel
        .read(ID)
        .catch(() => {
          setTimeout(() => window._$g.rdr("/404"));
        });
      debitEnt && this.setState({ debitEnt });
    })();
    //.end
  }

  render() {
    let { debitEnt } = this.state;
    let { noEdit } = this.props;

    // Ready?
    if (!debitEnt) {
      return <Loading />;
    }

    return (
      <DebitAdd
        debitEnt={debitEnt}
        noEdit={noEdit || userAuth._isAdministrator()}
        {...this.props}
      />
    );
  }
}
