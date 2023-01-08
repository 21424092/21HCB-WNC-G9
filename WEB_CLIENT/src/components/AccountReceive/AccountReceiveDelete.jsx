import React, { PureComponent } from 'react';

// Component(s)
// import Loading from '../Common/Loading';
import AccountReceiveDetail from './AccountReceiveDetail';

// Model(s)
import AccountReceiveModel from "../../models/AccountReceiveModel";

/**
 * @class AccountReceiveDelete
 */
export default class AccountReceiveDelete extends PureComponent {
  constructor(props) {
    super(props);

    // Init model(s)
    this._functionGroupModel = new AccountReceiveModel();

    // Bind method(s)
    this.handlePressBtnDelete = this.handlePressBtnDelete.bind(this);

    // Init state
    this.state = {
      /** @var {Boolean} */
      isSubmitting: false
    };
  }

  handlePressBtnDelete(funcGroupEnt) {
    //
    this.setState({ isSubmitting: true });
    //
    this._functionGroupModel.delete(funcGroupEnt.id())
      .then(data => { // OK
        window._$g.toastr.show('Xóa thành công!', 'success');
        setTimeout(() => {
          window._$g.rdr(-1);
        }, 0);
        // Chain
        return data;
      })
      .catch(apiData => { // NG
        window._$g.toastr.show('Xóa thất bại!', 'error');
        // Submit form is done!
        this.setState({ isSubmitting: true });
      })
    ;
  }

  render() {
    let { isSubmitting } = this.state;
    let props = this.props;
    return <AccountReceiveDetail {...props} isSubmitting={isSubmitting} deleteMode onPressBtnDelete={this.handlePressBtnDelete} />
  }
}
