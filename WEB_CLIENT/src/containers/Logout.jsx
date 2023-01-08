import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Container, Row, Spinner } from "reactstrap";
// Model(s)
import UserModel from "../models/UserModel";
import CustomerModel from "../models/CustomerModel";

/**
 * @class Logout
 */
export default class Logout extends Component {
  /**
   * @var {UserModel}
   */
  _userModel;
  _customerModel;

  constructor(props) {
    super(props);

    // Init model(s)
    this._userModel = new UserModel();
    this._customerModel = new CustomerModel();

    // Init state
    this.state = {
      // @var {UserEntity}|null
      userAuth: this._userModel.getUserAuth(),
      customerAuth: this._customerModel.getCustomerAuth(),
    };

    // Bind methods
    // ...
  }

  componentDidMount() {
    let { userAuth, customerAuth } = this.state;
    // Case: processing logout?!
    if (userAuth) {
      this._userModel.logout(userAuth).finally(() => {
        window.persistor.pause();
        window.persistor.flush().then(() => {
          return window.persistor.purge();
        });
        window.location.reload();
        // this.setState(() => ({ userAuth: null }));
      });
    }
    if (customerAuth) {
      this._customerModel.logout(customerAuth).finally(() => {
        window.persistor.pause();
        window.persistor.flush().then(() => {
          return window.persistor.purge();
        });
        window.location.reload();
        // this.setState(() => ({ userAuth: null }));
      });
    }
    //.end
  }

  render() {
    let { userAuth, customerAuth } = this.state;

    // Redirect to dashboard?!
    if (!userAuth || !customerAuth) {
      return <Redirect to="/" push />;
    }

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Spinner color="primary" />
            <span className="px-2 py-2">
              {window._$g._("Logging you out, please wait...")}
            </span>
          </Row>
        </Container>
      </div>
    );
  }
}
