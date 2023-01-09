import React, { PureComponent } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Alert,
  Card,
  CardBody,
  CardHeader,
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
import DebitModel from "../../models/DebitModel";

/**
 * @class DebitAdd
 */
export default class DebitAdd extends PureComponent {
  /** @var {Object} */
  formikProps = null;

  constructor(props) {
    super(props);

    // Init model(s)
    this._debitModel = new DebitModel();

    // Bind method(s)
    this.handleFormikSubmit = this.handleFormikSubmit.bind(this);
    this.handleFormikBeforeRender = this.handleFormikBeforeRender.bind(this);
    // Init state
    // +++
    // let { debitEnt } = props;
    // +++
    this.state = {
      /** @var {Array} */
      alerts: [],
      /** @var {Boolean} */
      ready: false,
    };
  }

  componentDidMount() {
    // Get bundle data --> ready data
    (async () => {
      let bundle = await this._getBundleData();
      this.setState({ ...bundle, ready: true });
    })();
    //.end
  }

  /**
   *
   * @return {Object}
   */
  getInitialValues() {
    let { debitEnt } = this.props;
    let values = Object.assign({}, this._debitModel.fillable(), {});
    if (debitEnt) {
      Object.assign(values, debitEnt);
    }
    // Format
    Object.keys(values).forEach((key) => {
      if (null === values[key]) {
        values[key] = "";
      }
    });
    // Return;
    return values;
  }

  /**
   * Goi API, lay toan bo data lien quan,...
   */
  async _getBundleData() {
    let bundle = {};
    let all = [];
    await Promise.all(all).catch((err) =>
      window._$g.dialogs.alert(
        window._$g._(`Khởi tạo dữ liệu không thành công (${err.message}).`),
        () => window.location.reload()
      )
    );
    //
    Object.keys(bundle).forEach((key) => {
      let data = bundle[key];
      let stateValue = this.state[key];
      if (data instanceof Array && stateValue instanceof Array) {
        data = [stateValue[0]].concat(data).filter((_i) => !!_i);
      }
      bundle[key] = data;
    });
    // console.log('bundle: ', bundle);
    //
    return bundle;
  }

  formikValidationSchema = Yup.object().shape({
    account_holder: Yup.string().required("Tên tài khoản là bắt buộc."),
    account_number: Yup.string().required("Số tài khoản là bắt buộc."),
    content_debit: Yup.string().required("Nội dung nhắc nợ bắt buộc."),
    current_debit: Yup.number().test(
      "so-tai-khoan-validation",
      "Số tiền nhắc nợ.",
      function (value) {
        if (!!value && value > 0) {
          return true;
        }
        return false;
      }
    ),
  });

  handleFormikBeforeRender({ initialValues }) {
    let { values } = this.formikProps;
    if (values === initialValues) {
      return;
    }
    // Reformat data
    Object.assign(values, {
      // +++
    });
  }
  handleChange = (event, setFieldValue, field) => {
    let alerts = [];
    this.setState(() => ({ alerts }));
    this._debitModel
      .getAccount(event.target.value)
      .then((data) => {
        if (data.account_id > 0) {
          setFieldValue("account_id", data.account_id * 1);
          setFieldValue("account_holder", data.account_holder);
          return field.onChange({
            target: {
              type: "select",
              name: "account_holder",
              value: data.account_holder,
            },
          });
        } else {
          let msg = [`<b>Tài khoản không tồn tại</b>`];
          alerts.push({ color: "danger", msg });
          this.setState(
            () => ({ alerts }),
            () => {
              window.scrollTo(0, 0);
            }
          );
        }
      })
      .catch((apiData) => {
        // NG
        let { errors, statusText, message } = apiData;
        let msg = [`<b>${statusText || message}</b>`]
          .concat(errors || [])
          .join("<br/>");
        alerts.push({ color: "danger", msg });
      });
  };
  /** @var {String} */
  _btnType = null;

  handleSubmit(btnType, { submitForm }) {    
    this._btnType = btnType;
    return submitForm();
  }

  handleFormikSubmit(values, fromProps) {
    let { debitEnt } = this.props;
    let { setSubmitting, resetForm } = fromProps;
    let willRedirect = false;
    let alerts = [];

    let formData = Object.assign({}, values);
    Object.keys(formData).forEach((key) => {
      if (typeof formData[key] === "boolean") {
        formData[key] = formData[key] ? 1 : 0;
      }
    });
    // console.log('formData: ', formData);
    //
    let apiCall = debitEnt
      ? this._debitModel.update(debitEnt.id(), formData)
      : this._debitModel.create(formData);
    apiCall
      .then((data) => {
        // OK
        window._$g.toastr.show("Lưu thành công!", "success");
        if (this._btnType === "save_n_close") {
          willRedirect = true;
          return window._$g.rdr("/debit-remind");
        }
        // Reset form (only when add new)
        if (!debitEnt) {
          resetForm();
        }
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
        !willRedirect &&
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
    let { debitEnt, noEdit } = this.props;
    /** @var {Object} */
    let initialValues = this.getInitialValues();

    // Ready?
    if (!ready) {
      return <Loading />;
    }

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <b>
                  {debitEnt ? (noEdit ? "Chi tiết" : "Chỉnh sửa") : "Thêm mới"}{" "}
                  người nhận {debitEnt ? `"${debitEnt.account_holder}"` : ""}
                </b>
              </CardHeader>
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
                  // validate={this.handleFormikValidate}
                  onSubmit={this.handleFormikSubmit}
                >
                  {(formikProps) => {
                    let {
                      submitForm,
                      resetForm,
                      handleSubmit,
                      handleReset,
                      isSubmitting,
                      setFieldValue,
                    } = (this.formikProps = formikProps);
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
                          <Col xs={12}>
                            <FormGroup row>
                              <Label for="account_number" sm={3}>
                                Số tài khoản
                                <span className="font-weight-bold red-text">
                                  *
                                </span>
                              </Label>
                              <Col sm={9}>
                                <Field
                                  name="account_number"
                                  render={({ field /* _form */ }) => (
                                    <Input
                                      {...field}
                                      onBlur={(e) =>
                                        this.handleChange(
                                          e,
                                          setFieldValue,
                                          field
                                        )
                                      }
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
                          <Col xs={12}>
                            <FormGroup row>
                              <Label for="account_holder" sm={3}>
                                Tên tài khoản
                                <span className="font-weight-bold red-text">
                                  *
                                </span>
                              </Label>
                              <Col sm={9}>
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
                          <Col xs={12}>
                            <FormGroup row>
                              <Label for="current_debit" sm={3}>
                                Số tiền
                              </Label>
                              <Col sm={9}>
                                <Field
                                  name="current_debit"
                                  render={({ field /* _form */ }) => (
                                    <Input
                                      {...field}
                                      onBlur={null}
                                      type="number"
                                      className="text-right"
                                      name="current_debit"
                                      id="current_debit"
                                      placeholder=""
                                      disabled={noEdit}
                                    />
                                  )}
                                />
                                <ErrorMessage
                                  name="current_debit"
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
                          <Col xs={12}>
                            <FormGroup row>
                              <Label for="content_debit" sm={3}>
                                Nội dung nhắc nợ
                              </Label>
                              <Col sm={9}>
                                <Field
                                  name="content_debit"
                                  render={({ field /* _form */ }) => (
                                    <Input
                                      {...field}
                                      onBlur={null}
                                      type="textarea"
                                      name="content_debit"
                                      id="content_debit"
                                      placeholder=""
                                      disabled={noEdit}
                                    />
                                  )}
                                />
                                <ErrorMessage
                                  name="content_debit"
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
                            {noEdit ? (
                              <Button
                                color="primary"
                                className="mr-2 btn-block-sm"
                                onClick={() =>
                                  window._$g.rdr(
                                    `/debit-remind/edit/${debitEnt.customer_debit_id}`
                                  )
                                }
                              >
                                <i className="fa fa-edit mr-1" />
                                Chỉnh sửa
                              </Button>
                            ) : (
                              [
                                <Button
                                  key="buttonSave"
                                  type="submit"
                                  color="primary"
                                  disabled={isSubmitting}
                                  onClick={(event) =>
                                    this.handleSubmit("save", {
                                      submitForm,
                                      resetForm,
                                      event,
                                    })
                                  }
                                  className="mr-2 btn-block-sm"
                                >
                                  <i className="fa fa-save mr-2" />
                                  Lưu
                                </Button>,
                                <Button
                                  key="buttonSaveClose"
                                  type="submit"
                                  color="success"
                                  disabled={isSubmitting}
                                  onClick={(event) =>
                                    this.handleSubmit("save_n_close", {
                                      submitForm,
                                      resetForm,
                                      event,
                                    })
                                  }
                                  className="mr-2 btn-block-sm mt-md-0 mt-sm-2"
                                >
                                  <i className="fa fa-save mr-2" />
                                  Lưu &amp; Đóng
                                </Button>,
                              ]
                            )}
                            <Button
                              disabled={isSubmitting}
                              onClick={() => window._$g.rdr("/debit-remind")}
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
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
