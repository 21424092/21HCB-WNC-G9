import React, { PureComponent } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Alert,
  Col,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
// Component(s)

import Loading from "../Common/Loading";

// Model(s)
import CustomerModel from "../../models/CustomerModel";

/**
 * @class CustomerAdd
 */
export default class CustomerAccountAdd extends PureComponent {
  /** @var {Object} */
  formikProps = null;

  constructor(props) {
    super(props);

    // Init model(s)
    this._customerModel = new CustomerModel();

    // Bind method(s)
    this.handleFormikBeforeRender = this.handleFormikBeforeRender.bind(this);
    this.handleFormikSubmit = this.handleFormikSubmit.bind(this);

    this.state = {
      /** @var {Number} */
      _id: 0,
      /** @var {Array} */
      alerts: [],
      /** @var {Boolean} */
      ready: false,
    };

    // Init validator
    this.formikValidationSchema = Yup.object().shape({
      account_number: Yup.string().test(
        "so-tai-khoan-validation",
        "Số tài khoản là bắt buộc.",
        function (value) {
          if (!!value) {
            return true;
          }
          return false;
        }
      ),
      account_holder: Yup.string().test(
        "ten-tai-khoan-validation",
        "Tên chủ tài khoản là bắt buộc.",
        function (value) {
          if (!!value) {
            return true;
          }
          return false;
        }
      ),
    });
  }

  componentDidMount() {
    // Get bundle data --> ready data
    (async () => {
      this.setState({ ready: true });
    })();
    //.end
  }

  /**
   *
   * @return {Object}
   */
  getInitialValues() {
    let { accountCustomerEnt } = this.props;
    let values = Object.assign({}, accountCustomerEnt);
    // Format
    Object.keys(values).forEach((key) => {
      if (null === values[key]) {
        values[key] = "";
      }
    });
    return values;
  }

  handleFormikBeforeRender({ initialValues }) {
    let { values } = this.formikProps;
    if (values === initialValues) {
      return;
    }
    // +++
    Object.assign(values, {});
  }

  /** @var {String} */
  _btnType = null;

  handleSubmit(btnType) {
    let { submitForm } = this.formikProps;
    this._btnType = btnType;
    window.scrollTo(0, 0);
    return submitForm();
  }

  handleFormikSubmit(values, formProps) {
    let { setSubmitting, handleReset } = formProps;
    let { onCloseDialog } = this.props;
    let willRedirect = false;
    let alerts = [];
    let formData = Object.assign({}, values);
    let apiCall = this._customerModel.createAccount(formData);
    apiCall
      .then((data) => {
        // OK
        window._$g.toastr.show("Lưu thành công!", "success");

        handleReset();
        onCloseDialog();
        // Chain
        return data;
      })
      .catch((apiData) => {
        // NG
        let { errors, statusText, message } = apiData;
        let msg = [`<b>${statusText || message}</b>`]
          .concat(errors || [])
          .join("<br/>");
        alerts.push({ color: "danger", msg });
      })
      .finally(() => {
        // Submit form is done!
        setSubmitting(false);
        //
        if (!willRedirect && !alerts.length) {
        }
        this.setState(
          () => ({ alerts }),
          () => {
            window.scrollTo(0, 0);
          }
        );
      });
  }

  render() {
    let { ready, alerts } = this.state;
    let { noEdit, onCloseDialog } = this.props;
    /** @var {Object} */
    let initialValues = this.getInitialValues();
    // Ready?
    if (!ready) {
      return <Loading />;
    }

    return (
      <div className="animated fadeIn">
        {/* general alerts */}
        {alerts.map(({ color, msg }, idx) => {
          return (
            <Alert
              key={`alert-${idx}`}
              color={color}
              isOpen={true}
              toggle={() => this.setState({ alerts: [] })}
            >
              <span dangerouslySetInnerHTML={{ __html: msg.toString() }} />
            </Alert>
          );
        })}
        <Row>
          <Col xs={12} sm={12}>
            <Formik
              initialValues={initialValues}
              validationSchema={this.formikValidationSchema}
              onSubmit={this.handleFormikSubmit}
            >
              {(formikProps) => {
                let { handleSubmit, handleReset, isSubmitting } =
                  (this.formikProps = formikProps);
                // [Event]
                this.handleFormikBeforeRender({ initialValues });
                // Render
                return (
                  <Form
                    id="form1st"
                    onSubmit={handleSubmit}
                    onReset={handleReset}
                  >
                    <Row>
                      <Col xs={12} sm={12}>
                        <FormGroup row>
                          <Label for="account_number" sm={4}>
                            Số tài khoản
                            <span className="font-weight-bold red-text">*</span>
                          </Label>
                          <Col sm={8}>
                            <Field
                              name="account_number"
                              render={({ field /* _form */ }) => (
                                <Input
                                  {...field}
                                  onBlur={null}
                                  type="text"
                                  name="account_number"
                                  id="account_number"
                                  placeholder=""
                                  disabled={noEdit}
                                />
                              )}
                            />
                            <ErrorMessage
                              name="account_number"
                              component={({ children }) => (
                                <Alert
                                  color="danger"
                                  className="field-validation-error"
                                >
                                  {children}
                                </Alert>
                              )}
                            />
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={12} sm={12}>
                        <FormGroup row>
                          <Label for="account_holder" sm={4}>
                            Tên chủ tài khoản
                            <span className="font-weight-bold red-text">*</span>
                          </Label>
                          <Col sm={8}>
                            <Field
                              name="account_holder"
                              render={({ field /* _form */ }) => (
                                <Input
                                  {...field}
                                  onBlur={null}
                                  type="text"
                                  name="account_holder"
                                  id="account_holder"
                                  placeholder=""
                                  disabled={noEdit}
                                />
                              )}
                            />
                            <ErrorMessage
                              name="account_holder"
                              component={({ children }) => (
                                <Alert
                                  color="danger"
                                  className="field-validation-error"
                                >
                                  {children}
                                </Alert>
                              )}
                            />
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12} sm={12}>
                        <FormGroup row>
                          <Label for="account_holder" sm={4}>
                            Số dư hiện tại
                            <span className="font-weight-bold red-text">*</span>
                          </Label>
                          <Col sm={8}>
                            <Field
                              name="current_balance"
                              render={({ field /* _form */ }) => (
                                <Input
                                  {...field}
                                  onBlur={null}
                                  name="current_balance"
                                  id="current_balance"
                                  type="number"
                                  placeholder=""
                                  disabled={noEdit}
                                />
                              )}
                            />
                            <ErrorMessage
                              name="current_balance"
                              component={({ children }) => (
                                <Alert
                                  color="danger"
                                  className="field-validation-error"
                                >
                                  {children}
                                </Alert>
                              )}
                            />
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12} className="text-right">
                        <Button
                          key="buttonSave"
                          type="submit"
                          color="primary"
                          disabled={isSubmitting}
                          onClick={() => this.handleSubmit("save")}
                          className="mr-2 btn-block-sm"
                        >
                          <i className="fa fa-save mr-2" />
                          Lưu
                        </Button>
                        <Button
                          onClick={() => {
                            handleReset();
                            onCloseDialog();
                          }}
                          className="btn-block-sm mt-md-0 mt-sm-2"
                        >
                          <i className="fa fa-times-circle mr-1" />
                          Đóng
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                );
              }}
            </Formik>
          </Col>
        </Row>
      </div>
    );
  }
}
