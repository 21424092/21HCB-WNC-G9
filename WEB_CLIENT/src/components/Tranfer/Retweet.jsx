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
  CustomInput,
} from "reactstrap";
import Select from "react-select";

// Component(s)

import Loading from "../Common/Loading";

// Model(s)
import AccountReceiveModel from "../../models/AccountReceiveModel";

/**
 * @class AccountReceiveAdd
 */
export default class Retweet extends PureComponent {
  /** @var {Object} */
  formikProps = null;

  constructor(props) {
    super(props);

    // Init model(s)
    this._accountReceiveModel = new AccountReceiveModel();

    // Bind method(s)
    this.handleFormikSubmit = this.handleFormikSubmit.bind(this);
    this.handleFormikBeforeRender = this.handleFormikBeforeRender.bind(this);
    // Init state
    // +++
    // let { accountReceiveEnt } = props;
    // +++
    this.state = {
      /** @var {Array} */
      alerts: [],
      /** @var {Boolean} */
      ready: false,
      /** @var {Array} */
      listbank: [{ name: "-- Chọn --", id: "" }],
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
    let { accountReceiveEnt } = this.props;
    let values = Object.assign({}, this._accountReceiveModel.fillable(), {});
    if (accountReceiveEnt) {
      Object.assign(values, accountReceiveEnt);
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
    let all = [
      this._accountReceiveModel
        .getListBank()
        .then((data) => (bundle["listbank"] = data)),
    ];
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
    bank_id: Yup.number().test(
      "so-tai-khoan-validation",
      "Vui lòng chọn ngân hàng.",
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

  /** @var {String} */
  _btnType = null;

  handleSubmit(btnType, { submitForm }) {
    this._btnType = btnType;
    return submitForm();
  }

  handleFormikSubmit(values, fromProps) {
    let { accountReceiveEnt } = this.props;
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
    let apiCall = accountReceiveEnt
      ? this._accountReceiveModel.update(accountReceiveEnt.id(), formData)
      : this._accountReceiveModel.create(formData);
    apiCall
      .then((data) => {
        // OK
        window._$g.toastr.show("Lưu thành công!", "success");
        if (this._btnType === "save_n_close") {
          willRedirect = true;
          return window._$g.rdr("/list-of-receiving-accounts");
        }
        // Reset form (only when add new)
        if (!accountReceiveEnt) {
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
    let { ready, alerts, listbank } = this.state;
    let { accountReceiveEnt, noEdit } = this.props;
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
                  {accountReceiveEnt
                    ? noEdit
                      ? "Chi tiết"
                      : "Chỉnh sửa"
                    : "Thêm mới"}{" "}
                  người nhận{" "}
                  {accountReceiveEnt
                    ? `"${accountReceiveEnt.account_holder}"`
                    : ""}
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
                      values,
                      submitForm,
                      resetForm,
                      handleSubmit,
                      handleReset,
                      isSubmitting,
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
                          <Col sm={12}>
                            <FormGroup row>
                              <Label for="account_list" sm={3}>
                                Ngân hàng
                                <span className="font-weight-bold red-text">
                                  *
                                </span>
                              </Label>
                              <Col sm={9}>
                                <Field
                                  name="bank_id"
                                  render={({ field /*, form*/ }) => {
                                    let options = listbank.map(
                                      ({ name: label, id: value }) => ({
                                        value,
                                        label,
                                      })
                                    );
                                    let defaultValue = options.find(
                                      ({ value }) => value === field.value
                                    );
                                    let placeholder =
                                      (listbank[0] && listbank[0].name) || "";
                                    return (
                                      <Select
                                        id="bank_id"
                                        name="bank_id"
                                        className="z-index-9999"
                                        onChange={(item) =>
                                          field.onChange({
                                            target: {
                                              type: "select",
                                              name: "bank_id",
                                              value: item.value,
                                            },
                                          })
                                        }
                                        isSearchable={true}
                                        placeholder={placeholder}
                                        defaultValue={defaultValue}
                                        options={options}
                                        isDisabled={noEdit}
                                      />
                                    );
                                  }}
                                />
                                <ErrorMessage
                                  name="bank_id"
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
                          <Col xs={12}>
                            <FormGroup row>
                              <Label for="nickname" sm={3}>
                                Biệt danh
                              </Label>
                              <Col sm={9}>
                                <Field
                                  name="nickname"
                                  render={({ field /* _form */ }) => (
                                    <Input
                                      {...field}
                                      onBlur={null}
                                      type="text"
                                      name="nickname"
                                      id="nickname"
                                      placeholder=""
                                      disabled={noEdit}
                                    />
                                  )}
                                />
                                <ErrorMessage
                                  name="nickname"
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
                              <Label for="is_active" sm={3}></Label>
                              <Col xs={6} sm={4}>
                                <Field
                                  name="is_active"
                                  render={({ field /* _form */ }) => (
                                    <CustomInput
                                      {...field}
                                      className="pull-left"
                                      onBlur={null}
                                      checked={values.is_active}
                                      type="switch"
                                      id="is_active"
                                      label="Kích hoạt?"
                                      disabled={noEdit}
                                    />
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
                                    `/list-of-receiving-accounts/edit/${accountReceiveEnt.customer_account_receive_id}`
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
                              onClick={() =>
                                window._$g.rdr("/list-of-receiving-accounts")
                              }
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
