import React, { PureComponent } from 'react';

// Component(s)
// import Loading from '../Common/Loading';
import CustomerDetail from './CustomerDetail';

// Model(s)
import CustomerModel from "../../models/CustomerModel";

/**
 * @class CustomerDelete
 */
export default class CustomerDelete extends PureComponent {
  constructor(props) {
    super(props);

    // Init model(s)
    this._userModel = new CustomerModel();

    // Bind method(s)
    this.handlePressBtnDelete = this.handlePressBtnDelete.bind(this);

    // Init state
    this.state = {
      /** @var {Boolean} */
      isSubmitting: false
    };
  }

  handlePressBtnDelete(userEnt) {
    //
    this.setState({ isSubmitting: true });
    //
    this._userModel.delete(userEnt.id())
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
    return <CustomerDetail {...props} isSubmitting={isSubmitting} deleteMode onPressBtnDelete={this.handlePressBtnDelete} />
  }
}
