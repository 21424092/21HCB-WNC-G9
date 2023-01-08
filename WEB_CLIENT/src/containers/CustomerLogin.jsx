import React, { Component } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Redirect } from "react-router-dom";
import {
  GoogleReCaptchaProvider,
  GoogleReCaptcha,
} from "react-google-recaptcha-v3";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Spinner,
  Alert,
} from "reactstrap";
// Model(s)
import CustomerModel from "../models/CustomerModel";
import bg from "../assets/img/bg.jpeg";

/**
 * @class Login
 */
export default class CustomerLogin extends Component {
  /**
   * @var {UserModel}
   */
  _customerModel;
  formikValidationSchema = Yup.object().shape({
    user_name: Yup.string().required("Tên đăng nhập là bắt buộc."),
    password: Yup.string().required("Mật khẩu là bắt buộc."),
  });

  constructor(props) {
    super(props);
    // Init model(s)
    this._customerModel = new CustomerModel();

    // Init state
    this.state = {
      // @var {UserEntity}|null
      customerAuth: this._customerModel.getCustomerAuth(),
      alerts: [],
      gg_token: "",
      refreshReCaptcha: false,
    };

    // Bind methods
    this.handleFormikSubmit = this.handleFormikSubmit.bind(this);
  }
  shouldComponentUpdate(prevProps, prevState) {
    if (prevState.refreshReCaptcha !== this.state.refreshReCaptcha) {
      return true;
    } else {
      return false;
    }
  }
  /**
   *
   * @return {Object}
   */
  getInitialValues() {
    let values = Object.assign({
      user_name: "",
      password: "",
    });
    // Return;
    return values;
  }

  /**
   * Handle form's submit
   * @returns false
   */
  handleFormikSubmit(values, formProps) {
    let { gg_token, refreshReCaptcha } = this.state;
    let { setSubmitting } = formProps;
    let alerts = [];
    let customerAuth = null;
    //
    this.setState(
      () => ({ alerts }),
      () => {
        window.scrollTo(0, 0);
      }
    );

    this._customerModel
      .login(values.user_name, values.password, gg_token)
      .then((data) => {
        customerAuth = data;

        this.setState(() => ({
          customerAuth,
          alerts,
          refreshReCaptcha: !refreshReCaptcha,
        }));
      })
      .catch((err) => {
        alerts.push({ color: "danger", msg: err.message });
      })
      .finally(() => {
        // Submit form is done!
        setSubmitting(false);
        //
        this.setState(() => ({
          customerAuth,
          alerts,
        }));
      });

    return false;
  }

  render() {
    let { customerAuth, alerts, refreshReCaptcha } = this.state;
    /** @var {Object} */
    let initialValues = this.getInitialValues();
    // Redirect to dashboard?!
    if (customerAuth) {
      return <Redirect to="/" push />;
    }
    return (
      <div
        className="app flex-row align-items-center"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
        }}
      >
        <GoogleReCaptchaProvider
          reCaptchaKey={process.env.REACT_APP_RECAPTCHA_KEY}
        >
          <Container>
            <Row className="justify-content-center">
              <Col md="5">
                <CardGroup>
                  <Card className="p-4">
                    <CardBody>
                      {/* general alerts */}
                      {alerts.map(({ color, msg }, idx) => {
                        return (
                          <Alert
                            key={`alert-${idx}`}
                            color={color}
                            isOpen={true}
                            toggle={() => this.setState({ alerts: [] })}
                          >
                            <span dangerouslySetInnerHTML={{ __html: msg }} />
                          </Alert>
                        );
                      })}
                      <Formik
                        initialValues={initialValues}
                        validationSchema={this.formikValidationSchema}
                        validateOnBlur={false}
                        validateOnChange={false}
                        onSubmit={this.handleFormikSubmit}
                      >
                        {(formikProps) => {
                          let { handleSubmit, handleReset, isSubmitting } =
                            (this.formikProps = formikProps);
                          return (
                            <Form onSubmit={handleSubmit} onReset={handleReset}>
                              <fieldset disabled={isSubmitting}>
                                <h1>{window._$g._("Đăng nhập")}</h1>
                                <p className="text-muted">
                                  {window._$g._("Đăng nhập phân hệ khách hàng")}
                                </p>
                                <InputGroup className="mb-1">
                                  <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                      <i className="icon-user" />
                                    </InputGroupText>
                                  </InputGroupAddon>
                                  <Field
                                    name="user_name"
                                    render={({ field /* _form */ }) => (
                                      <Input
                                        {...field}
                                        onBlur={null}
                                        type="text"
                                        id="user_name"
                                        placeholder="Tên đăng nhập"
                                      />
                                    )}
                                  />
                                </InputGroup>
                                <ErrorMessage
                                  name="user_name"
                                  component={({ children }) => (
                                    <Alert
                                      color="danger"
                                      className="field-validation-error"
                                    >
                                      {children}
                                    </Alert>
                                  )}
                                />
                                <InputGroup className="mt-3 mb-1">
                                  <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                      <i className="icon-lock" />
                                    </InputGroupText>
                                  </InputGroupAddon>
                                  <Field
                                    name="password"
                                    render={({ field /* _form */ }) => (
                                      <Input
                                        {...field}
                                        onBlur={null}
                                        type="password"
                                        id="password"
                                        placeholder="Mật khẩu"
                                      />
                                    )}
                                  />
                                </InputGroup>
                                <ErrorMessage
                                  name="password"
                                  component={({ children }) => (
                                    <Alert
                                      color="danger"
                                      className="field-validation-error"
                                    >
                                      {children}
                                    </Alert>
                                  )}
                                />
                                <InputGroup className="mb-4">
                                  <Col xs="12">
                                    <GoogleReCaptcha
                                      refreshReCaptcha={refreshReCaptcha}
                                      onVerify={(token) => {
                                        this.setState({
                                          gg_token: token,
                                        });
                                      }}
                                    />
                                  </Col>
                                </InputGroup>
                                <Row className="mt-3">
                                  <Col xs="12">
                                    <Button
                                      type="submit"
                                      color="primary"
                                      className="btn btn-primary col-12"
                                    >
                                      {window._$g._("Đăng nhập")}
                                    </Button>
                                    {isSubmitting ? (
                                      <div className="d-flex col-12 mt-3 justify-content-center ">
                                        <Spinner color="primary" />
                                      </div>
                                    ) : null}
                                  </Col>
                                </Row>
                              </fieldset>
                            </Form>
                          );
                        }}
                      </Formik>
                    </CardBody>
                  </Card>
                </CardGroup>
              </Col>
            </Row>
          </Container>
        </GoogleReCaptchaProvider>
      </div>
    );
  }
}
