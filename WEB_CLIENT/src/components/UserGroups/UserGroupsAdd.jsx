import React, { Component } from "react";
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

// Component(s)
import { CheckAccess } from "../../navigation/VerifyAccess";
import Loading from "../Common/Loading";

// Model(s)
import UserGroupModel from "../../models/UserGroupModel";

/** @var {Object} */
const userAuth = window._$g.userAuth;

/**
 * @class SegmentAdd
 */
export default class UserGroupsAdd extends Component {
  /** @var {Object} */
  formikProps = null;

  constructor(props) {
    super(props);

    // Init model(s)
    this._userGroupsModel = new UserGroupModel();
    // Bind method(s)
    this.handleFormikSubmit = this.handleFormikSubmit.bind(this);
    this.handleFormikReset = this.handleFormikReset.bind(this);
    // +++
    this.state = {
      /** @var {Number} */
      _id: 0,
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

  formikValidationSchema = Yup.object().shape({
    user_group_name: Yup.string().required("Tên nhóm là băt buộc."),
    order_index: Yup.number()
      .min(0, "Thứ tự bắt buộc lớn hơn hoặc bằng 0")
      .required("Thứ tự là bắt buộc."),
  });

  /** @var {String} */
  _btnType = null;

  getInitialValues() {
    let { UserGroupEnti } = this.props;
    let values = Object.assign({}, this._userGroupsModel.fillable());
    if (UserGroupEnti) {
      Object.assign(values, UserGroupEnti);
    }
    // Format
    Object.keys(values).forEach((key) => {
      if (null === values[key]) {
        values[key] = "";
      }
      // if (key === '') {}
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
        data = [stateValue[0]].concat(data);
      }
      bundle[key] = data;
    });

    return bundle;
  }

  handleSubmit(btnType) {
    let { submitForm } = this.formikProps;
    this._btnType = btnType;
    return submitForm();
  }

  handleFormikSubmit(values, formProps) {
    let { UserGroupEnti } = this.props;
    let { setSubmitting, resetForm } = formProps;
    let willRedirect = false;
    let alerts = [];
    // Build form data
    let formData = Object.assign({}, values, {
      order_index: "" + values.order_index,
      is_active: 1 * values.is_active,
      user_group_functions: [],
    });
    let _userGroupId =
      (UserGroupEnti && UserGroupEnti.user_group_id) ||
      formData[this._userGroupsModel];

    let apiCall = _userGroupId
      ? this._userGroupsModel.edit(_userGroupId, formData)
      : this._userGroupsModel.create(formData);
    apiCall
      .then((data) => {
        // OK
        window._$g.toastr.show("Lưu thành công!", "success");
        if (this._btnType === "save_n_close") {
          willRedirect = true;
          return window._$g.rdr("/user-groups");
        }

        if (this._btnType === "save" && !_userGroupId) {
          resetForm();
          this.setState({ company: null });
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
        if (!UserGroupEnti && !willRedirect && !alerts.length) {
          this.handleFormikReset();
        }

        this.setState(
          () => ({ alerts }),
          () => {
            window.scrollTo(0, 0);
          }
        );
      });
  }

  handleFormikReset() {
    this.setState((state) => ({
      ready: true,
      alerts: [],
    }));
  }

  render() {
    let { _id, ready, alerts } = this.state;
    let { UserGroupEnti, noEdit } = this.props;
    let initialValues = this.getInitialValues();
    // Ready?
    if (!ready) {
      return <Loading />;
    }

    return (
      <div key={`view-${_id}`} className="animated fadeIn">
        <Row className="d-flex justify-content-center">
          <Col xs={12} md={12}>
            <Card>
              <CardHeader>
                <b>
                  {UserGroupEnti
                    ? noEdit
                      ? "Chi tiết"
                      : "Chỉnh sửa"
                    : "Thêm mới"}{" "}
                  nhóm người dùng{" "}
                  {UserGroupEnti ? UserGroupEnti.user_group_name : ""}
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
                  onSubmit={this.handleFormikSubmit}
                >
                  {(formikProps) => {
                    let { values, handleSubmit, handleReset, isSubmitting } =
                      (this.formikProps =
                      window._formikProps =
                        formikProps);
                    // Render
                    return (
                      <Form
                        id="form1st"
                        onSubmit={handleSubmit}
                        onReset={handleReset}
                      >
                        <Col xs={12}>
                          <Row>
                            <Col xs={12}>
                              <FormGroup row>
                                <Label for="user_group_name" sm={3}>
                                  Tên nhóm{" "}
                                  <span className="font-weight-bold red-text">
                                    *
                                  </span>
                                </Label>
                                <Col sm={9}>
                                  <Field
                                    name="user_group_name"
                                    render={({ field }) => (
                                      <Input
                                        {...field}
                                        onBlur={null}
                                        type="text"
                                        placeholder=""
                                        disabled={noEdit}
                                      />
                                    )}
                                  />
                                  <ErrorMessage
                                    name="user_group_name"
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
                            <Col xs={12}>
                              <FormGroup row>
                                <Label for="order_index" sm={3}>
                                  Thứ tự
                                  <span className="font-weight-bold red-text">
                                    *
                                  </span>
                                </Label>
                                <Col sm={9}>
                                  <Field
                                    name="order_index"
                                    render={({ field /* _form */ }) => (
                                      <Input
                                        {...field}
                                        onBlur={null}
                                        type="number"
                                        id={field.name}
                                        className="text-right"
                                        placeholder=""
                                        disabled={noEdit}
                                        min={0}
                                      />
                                    )}
                                  />
                                  <ErrorMessage
                                    name="order_index"
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
                            <Col xs={12}>
                              <FormGroup row>
                                <Label for="description" sm={3}>
                                  Mô tả
                                </Label>
                                <Col sm={9}>
                                  <Field
                                    name="description"
                                    render={({ field /* _form */ }) => (
                                      <Input
                                        {...field}
                                        onBlur={null}
                                        type="textarea"
                                        id="description"
                                        disabled={noEdit}
                                      />
                                    )}
                                  />
                                </Col>
                              </FormGroup>
                            </Col>
                            <Col xs={12}>
                              <Row>
                                <Col xs={12}>
                                  <FormGroup row>
                                    <Label for="ward_id" sm={3}></Label>
                                    <Col sm={4}>
                                      <Field
                                        name="is_active"
                                        render={({ field }) => (
                                          <CustomInput
                                            {...field}
                                            className="pull-left"
                                            onBlur={null}
                                            defaultChecked={
                                              values.user_group_id !== ""
                                                ? values.is_active
                                                : 1
                                            }
                                            type="switch"
                                            id="is_active"
                                            label="Kích hoạt"
                                            disabled={noEdit}
                                          />
                                        )}
                                      />
                                    </Col>
                                  </FormGroup>
                                </Col>
                              </Row>

                              <Row>
                                <Col xs={12}>
                                  <FormGroup row>
                                    <Label for="" sm={3}></Label>
                                    <Col sm={12} className="text-right">
                                      {noEdit ? (
                                        <CheckAccess permission="AM_BUSINESSTYPE_EDIT">
                                          <Button
                                            color="primary"
                                            className="mr-2 btn-block-sm"
                                            onClick={() =>
                                              window._$g.rdr(
                                                `/user-groups/edit/${UserGroupEnti.id()}`
                                              )
                                            }
                                            disabled={
                                              userAuth._isAdministrator() &&
                                              UserGroupEnti.is_system !== 0
                                            }
                                          >
                                            <i className="fa fa-edit mr-1" />
                                            Chỉnh sửa
                                          </Button>
                                        </CheckAccess>
                                      ) : (
                                        [
                                          <Button
                                            type="submit"
                                            color="primary"
                                            disabled={isSubmitting}
                                            onClick={() =>
                                              this.handleSubmit("save")
                                            }
                                            className="ml-3"
                                          >
                                            <i className="fa fa-edit" /> Lưu
                                          </Button>,
                                          <Button
                                            type="submit"
                                            color="success"
                                            disabled={isSubmitting}
                                            onClick={() =>
                                              this.handleSubmit("save_n_close")
                                            }
                                            className="ml-3"
                                          >
                                            <i className="fa fa-edit" /> Lưu
                                            &amp; Đóng
                                          </Button>,
                                        ]
                                      )}
                                      <Button
                                        disabled={isSubmitting}
                                        onClick={() =>
                                          window._$g.rdr("/user-groups")
                                        }
                                        className="ml-3"
                                      >
                                        <i className="fa fa-close" />
                                        <span className="ml-1">Đóng</span>
                                      </Button>
                                    </Col>
                                  </FormGroup>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
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
