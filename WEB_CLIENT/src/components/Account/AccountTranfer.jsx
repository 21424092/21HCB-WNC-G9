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
import Select from "react-select";
import Loading from "../Common/Loading";
import CustomerModel from "../../models/CustomerModel";

export default class AccountTranfer extends PureComponent {
  /** @var {Object} */
  formikProps = null;

  constructor(props) {
    super(props);
    this._customerModel = new CustomerModel();

    this.handleFormikBeforeRender = this.handleFormikBeforeRender.bind(this);
    this.handleFormikSubmit = this.handleFormikSubmit.bind(this);

    this.state = {
      /** @var {Number} */
      _id: 0,
      /** @var {Array} */
      alerts: [],
      /** @var {Boolean} */
      ready: false,
      /** @var {Array} */
      account_list: [{ name: "-- Chọn --", id: "" }],
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
      current_balance: Yup.number().test(
        "ten-tai-khoan-validation",
        "Số tiền nộp là bắt buộc.",
        function (value) {
          if (!!value && value !== 0) {
            return true;
          }
          return false;
        }
      ),
    });
  }

  componentDidMount() {
    // Get bundle data
    (async () => {
      let bundle = await this._getBundleData();
      let { account_list = [] } = this.state;
      //
      account_list = account_list.concat(bundle.account_list || []);
      // ...
      this.setState({
        ready: true,
        account_list,
      });
    })();
    //.end
  }

  /**
   * Goi API, lay toan bo data lien quan, vd: chuc vu, phong ban, dia chi,...
   */
  async _getBundleData() {
    let { paidAccountCustomerEnt: data } = this.props;
    let bundle = {};
    let all = [
      this._customerModel
        .getOptions(data.customer_id)
        .then((data) => (bundle["account_list"] = data)),
    ];
    await Promise.all(all).catch(() =>
      this.setState({
        openPaid: false,
        paidAccountCustomer: {
          customer_id: "",
          account_number: "",
          current_balance: 0,
        },
      })
    );
    return bundle;
  }

  /**
   *
   * @return {Object}
   */
  getInitialValues() {
    let { paidAccountCustomerEnt } = this.props;
    let values = Object.assign({}, paidAccountCustomerEnt);
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
    let { setSubmitting, resetForm } = formProps;
    let { onCloseDialog } = this.props;
    let willRedirect = false;
    let alerts = [];
    let formData = Object.assign({}, values);
    console.log(formData)
    let apiCall = this._customerModel.updatePaidAccount(formData);
    apiCall
      .then((data) => {
        // OK
        window._$g.toastr.show("Lưu thành công!", "success");

        resetForm();
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
    let { ready, alerts, account_list } = this.state;
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
                    id="form1st-update"
                    onSubmit={handleSubmit}
                    onReset={handleReset}
                  >
                    <Row>
                      <Col sm={12}>
                        <FormGroup row>
                          <Label
                            for="account_list"
                            sm={4}
                          >
                            Tài khoản nộp
                            <span className="font-weight-bold red-text">*</span>
                          </Label>
                          <Col sm={8}>
                            <Field
                              name="account_number"
                              render={({ field /*, form*/ }) => {
                                let options = account_list.map(
                                  ({ name: label, id: value }) => ({
                                    value,
                                    label,
                                  })
                                );
                                let defaultValue = options.find(
                                  ({ value }) => value === field.value
                                );
                                let placeholder =
                                  (account_list[0] && account_list[0].name) ||
                                  "";
                                return (
                                  <Select
                                    id="account_number"
                                    name="account_number"
                                    className="z-index-9999"
                                    onChange={(item) =>
                                      field.onChange({
                                        target: {
                                          type: "select",
                                          name: "account_number",
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
                            Số tiền cần nộp
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
