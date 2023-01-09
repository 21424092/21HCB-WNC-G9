import React, { PureComponent } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Col,
  Row,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
// Material
import MUIDataTable from "mui-datatables";
import { CircularProgress } from "@material-ui/core";

// Util(s)
import { layoutFullWidthHeight } from "../../utils/html";
import {
  configTableOptions,
  configIDRowTable,
  numberFormat,
} from "../../utils/index";
// Model(s)
import DebitModel from "../../models/DebitModel";
// Component(s)

import DebitsFilter from "./DebitFilter";
import CustomPagination from "../../utils/CustomPagination";
import UserModel from "../../models/UserModel";
// Set layout full-wh
layoutFullWidthHeight();

/**
 * @class Debits
 */
class Debit extends PureComponent {
  /**
   * @var {DebitModel}
   */
  _debitModel;

  constructor(props) {
    super(props);

    // Init model(s)
    this._debitModel = new DebitModel();
    this._userModel = new UserModel();
  }
  state = {
    toggleSearch: true,
    page: 0,
    count: 1,
    data: [],
    isLoading: false,
    query: {
      itemsPerPage: 25,
      page: 1,
    },
    openPaid: false,
    debitCancel: null,
    openPayment: false,
    debitPayment: null,
    type: "",
    id: 0,
    rowIndex: 0,
    content: "",
  };

  componentDidMount() {
    this.getData({ ...this.state.query });
  }

  // get data
  getData = (query = {}) => {
    this.setState({ isLoading: true });
    return this._debitModel.list(query).then((res) => {
      let data = [...res.items];
      let isLoading = false;
      let count = res.totalItems;
      let page = query["page"] - 1 || 0;

      this.setState(
        {
          isLoading,
        },
        () => {
          this.setState({
            data,
            count,
            page,
            query,
          });
        }
      );
    });
  };

  /**
   * Goi API, lay toan bo data lien quan, vd: chuc vu, phong ban, dia chi,...
   */
  _getBundleData() {
    let bundle = {};
    return bundle;
  }

  handleActionItemClick = (type, id, rowIndex) => {
    if (type.match(/payment/i)) {
      this.handlePayment(id, rowIndex);
    } else {
      this.setState({
        openPaid: true,
        debitCancel: {
          customer_debit_id: id * 1,
          content: "",
        },
        type,
        id,
        rowIndex,
      });
    }
  };
  handleSubmitCancelDebit = (type, id, rowIndex) => {
    window._$g.dialogs.prompt(
      "Bạn có chắc chắn muốn xóa dữ liệu đang chọn?",
      "Xóa",
      (confirm) => this.handleDelete(confirm, id, rowIndex)
    );
  };
  handleClickAdd = () => {
    window._$g.rdr("/debit-remind/add");
  };
  handleDelete = (confirm, id, rowIndex) => {
    const { debitCancel, data, content } = this.state;
    let model = Object.assign({ ...debitCancel }, { content });
    if (confirm) {
      this._debitModel
        .canceldebit(model)
        .then(() => {
          const cloneData = [...data];
          cloneData.splice(rowIndex, 1);
          const count = cloneData.length;
          this.setState({
            data: cloneData,
            count,
            openPaid: false,
          });
        })
        .catch(() => {
          window._$g.dialogs.alert(
            window._$g._("Bạn vui lòng chọn dòng dữ liệu cần thao tác!")
          );
        });
    }
  };
  handlePayment = (id, rowIndex) => {
    window._$g.dialogs.prompt(
      "Bạn có chắc chắn muốn thanh toán nợ?",
      "Cập nhật",
      (confirm) => this.onPayment(confirm, id, rowIndex)
    );
  };
  onPayment = (confirm, id, idx) => {
    if (confirm) {
      this.setState({
        openPayment: true,
        debitPayment: {
          customer_debit_id: id * 1,
          opt: "",
        },
        id,
        rowIndex: idx,
      });
      this._debitModel
        .sendOTP(id)
        .then((data) => {})
        .catch(() => {
          window._$g.toastr.show(
            "Cập nhật trạng thái không thành công.",
            "error"
          );
        });
    }
  };
  handleOTPPayment = () => {
    const { debitPayment, otp, rowIndex, data } = this.state;
    let model = Object.assign({ ...debitPayment }, { otp });
    this._debitModel
      .donedebit(model)
      .then(() => {
        const cloneData = [...data];
        cloneData.splice(rowIndex, 1);
        const count = cloneData.length;
        this.setState({
          data: cloneData,
          count,
          openPayment: false,
        });
      })
      .catch(() => {
        window._$g.dialogs.alert(
          window._$g._("Bạn vui lòng chọn dòng dữ liệu cần thao tác!")
        );
      });
  };
  handleSubmitFilter = (keyword, created_date_from, created_date_to) => {
    let query = { ...this.state.query };
    query.page = 1;
    query = Object.assign(query, {
      keyword,
      created_date_from,
      created_date_to,
    });
    this.getData(query).catch(() => {
      window._$g.dialogs.alert(
        window._$g._("Bạn vui lòng chọn dòng dữ liệu cần thao tác!")
      );
    });
  };

  handleChangeRowsPerPage = (event) => {
    let query = { ...this.state.query };
    query.itemsPerPage = event.target.value;
    query.page = 1;
    this.getData(query);
  };

  handleChangePage = (event, newPage) => {
    let query = { ...this.state.query };
    query.page = newPage + 1;
    this.getData(query);
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleChangeOTP = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const columns = [
      configIDRowTable(
        "customer_debit_id",
        "/debit-remind/details/",
        this.state.query
      ),
      {
        name: "account_holder",
        label: "Tên tài khoản",
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: "account_number",
        label: "Số tài khoản",
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: "current_debit",
        label: "Số tiền nợ",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            return <div className="text-right">{numberFormat(value)}</div>;
          },
        },
      },
      {
        name: "content_debit",
        label: "Nội dung nợ",
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: "status_debit",
        label: "Trạng thái",
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: "Thao tác",
        options: {
          filter: false,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            if (this.state.data[tableMeta["rowIndex"]].show_button) {
              return (
                <div className="text-center">
                  <Button
                    color="primary"
                    title="Thanh toán"
                    className="mr-1"
                    onClick={(evt) =>
                      this.handleActionItemClick(
                        "payment",
                        this.state.data[tableMeta["rowIndex"]]
                          .customer_debit_id,
                        tableMeta["rowIndex"]
                      )
                    }
                  >
                    <i className="fa fa-money" />
                  </Button>
                  <Button
                    color="danger"
                    title="Xóa"
                    className=""
                    onClick={(evt) =>
                      this.handleActionItemClick(
                        "delete",
                        this.state.data[tableMeta["rowIndex"]]
                          .customer_debit_id,
                        tableMeta["rowIndex"]
                      )
                    }
                  >
                    <i className="fa fa-trash" />
                  </Button>
                </div>
              );
            } else {
              return <></>;
            }
          },
        },
      },
    ];

    const {
      count,
      page,
      query,
      debitCancel,
      openPaid,
      debitPayment,
      openPayment,
      type,
      id,
      rowIndex,
      content,
      otp,
    } = this.state;
    const options = configTableOptions(count, page, query);

    return (
      <div>
        <Card className="animated fadeIn z-index-222 mb-3">
          <CardHeader className="d-flex">
            <div className="flex-fill font-weight-bold">Thông tin tìm kiếm</div>
            <div
              className="minimize-icon cur-pointer"
              onClick={() =>
                this.setState((prevState) => ({
                  toggleSearch: !prevState.toggleSearch,
                }))
              }
            >
              <i
                className={`fa ${
                  this.state.toggleSearch ? "fa-minus" : "fa-plus"
                }`}
              />
            </div>
          </CardHeader>
          {this.state.toggleSearch && (
            <CardBody className="px-0 py-0">
              <div className="MuiPaper-filter__custom z-index-2">
                <DebitsFilter
                  userArr={this.state.user}
                  handleSubmit={this.handleSubmitFilter}
                  handleAdd={this.handleClickAdd}
                />
              </div>
            </CardBody>
          )}
        </Card>
        <Button
          className="col-12 max-w-110 mb-3 mobile-reset-width"
          onClick={() => this.handleClickAdd()}
          color="success"
          size="sm"
        >
          <i className="fa fa-plus" />
          <span className="ml-1">Thêm mới</span>
        </Button>
        <Card className="animated fadeIn">
          <CardBody className="px-0 py-0">
            <div className="MuiPaper-root__custom">
              {this.state.isLoading ? (
                <div className="d-flex flex-fill justify-content-center mt-5 mb-5">
                  <CircularProgress />
                </div>
              ) : (
                <div>
                  <MUIDataTable
                    data={this.state.data}
                    columns={columns}
                    options={options}
                  />
                  <CustomPagination
                    count={count}
                    rowsPerPage={query.itemsPerPage}
                    page={page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  />
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        <Dialog
          open={!!openPaid}
          keepMounted
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle id="alert-dialog-slide-title">
            <b>Xác nhận xóa nợ</b>
          </DialogTitle>
          <DialogContent>
            {!!debitCancel && (
              <>
                <Row>
                  <Col xs={12}>
                    <FormGroup row>
                      <Label for="content" sm={3}>
                        Lý do hủy
                      </Label>
                      <Col sm={9}>
                        <Input
                          className="MuiPaper-filter__custom--input"
                          autoComplete="nope"
                          type="textarea"
                          name="content"
                          placeholder=" Lý do"
                          value={content || ""}
                          inputprops={{
                            name: "content",
                          }}
                          onChange={this.handleChange}
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
                      onClick={() =>
                        this.handleSubmitCancelDebit(type, id, rowIndex)
                      }
                      className="mr-2 btn-block-sm"
                    >
                      <i className="fa fa-save mr-2" />
                      Lưu
                    </Button>
                    <Button
                      onClick={() => {
                        this.setState({
                          openPaid: !openPaid,
                          paidAccountCustomer: {
                            customer_debit_id: "",
                            content: "",
                          },
                        });
                      }}
                      className="btn-block-sm mt-md-0 mt-sm-2"
                    >
                      <i className="fa fa-times-circle mr-1" />
                      Đóng
                    </Button>
                  </Col>
                </Row>
              </>
            )}
          </DialogContent>
        </Dialog>
        <Dialog
          open={!!openPayment}
          keepMounted
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle id="alert-dialog-slide-title">
            <b>XÁC NHẬN OTP</b>
          </DialogTitle>
          <DialogContent>
            {!!debitPayment && (
              <>
                <Row>
                  <Col xs={12}>
                    <FormGroup row>
                      <Col sm={12}>
                        <Input
                          className="MuiPaper-filter__custom--input"
                          autoComplete="nope"
                          type="text"
                          name="otp"
                          value={otp || ""}
                          inputprops={{
                            name: "otp",
                          }}
                          onChange={this.handleChangeOTP}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col sm={12} className="text-center">
                    <Button
                      key="buttonSave"
                      type="submit"
                      color="primary"
                      onClick={() => this.handleOTPPayment()}
                      className="mr-2 btn-block-sm"
                    >
                      <i className="fa fa-save mr-2" />
                      Xác nhận
                    </Button>
                  </Col>
                </Row>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default Debit;
