import React, { PureComponent } from "react";
import { Card, CardBody, CardHeader, Button } from "reactstrap";
// Material
import MUIDataTable from "mui-datatables";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { CircularProgress } from "@material-ui/core";

// Util(s)
import { layoutFullWidthHeight } from "../../utils/html";
import { configTableOptions, configIDRowTable } from "../../utils/index";
// Model(s)
import AccountReceiveModel from "../../models/AccountReceiveModel";
// Component(s)

import AccountReceivesFilter from "./AccountReceiveFilter";
import CustomPagination from "../../utils/CustomPagination";
import UserModel from "../../models/UserModel";
// Set layout full-wh
layoutFullWidthHeight();

/**
 * @class AccountReceives
 */
class AccountReceive extends PureComponent {
  /**
   * @var {AccountReceiveModel}
   */
  _accountReceiveModel;

  constructor(props) {
    super(props);

    // Init model(s)
    this._accountReceiveModel = new AccountReceiveModel();
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
  };

  componentDidMount() {
    this.getData({ ...this.state.query });
  }

  // get data
  getData = (query = {}) => {
    this.setState({ isLoading: true });
    return this._accountReceiveModel.list(query).then((res) => {
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
    let routes = {
      detail: "/list-of-receiving-accounts/details/",
      delete: "/list-of-receiving-accounts/delete/",
      edit: "/list-of-receiving-accounts/edit/",
    };
    const route = routes[type];
    if (type.match(/detail|edit/i)) {
      window._$g.rdr(`${route}${id}`);
    } else {
      window._$g.dialogs.prompt(
        "Bạn có chắc chắn muốn xóa dữ liệu đang chọn?",
        "Xóa",
        (confirm) => this.handleDelete(confirm, id, rowIndex)
      );
    }
  };

  handleDelete = (confirm, id, rowIndex) => {
    const { data } = this.state;
    if (confirm) {
      this._accountReceiveModel
        .delete(id)
        .then(() => {
          const cloneData = [...data];
          cloneData.splice(rowIndex, 1);
          const count = cloneData.length;
          this.setState({
            data: cloneData,
            count,
          });
        })
        .catch(() => {
          window._$g.dialogs.alert(
            window._$g._("Bạn vui lòng chọn dòng dữ liệu cần thao tác!")
          );
        });
    }
  };
  handleChangeStatus = (status, id, rowIndex) => {
    window._$g.dialogs.prompt(
      "Bạn có chắc chắn muốn thay đổi trạng thái dữ liệu đang chọn?",
      "Cập nhật",
      (confirm) => this.onChangeStatus(confirm, status, id, rowIndex)
    );
  };

  onChangeStatus = (confirm, status, id, idx) => {
    if (confirm) {
      let postData = { is_active: status ? 1 : 0 };
      this._accountReceiveModel
        .changeStatus(id, postData)
        .then(() => {
          const cloneData = [...this.state.data];
          cloneData[idx].is_active = status;
          this.setState(
            {
              data: cloneData,
            },
            () => {
              window._$g.toastr.show(
                "Cập nhật trạng thái thành công.",
                "success"
              );
            }
          );
        })
        .catch(() => {
          window._$g.toastr.show(
            "Cập nhật trạng thái không thành công.",
            "error"
          );
        });
    }
  };
  handleSubmitFilter = (keyword) => {
    let query = { ...this.state.query };
    query.page = 1;
    query = Object.assign(query, {
      keyword,
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

  render() {
    const columns = [
      configIDRowTable(
        "customer_account_receive_id",
        "/list-of-receiving-accounts/details/",
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
        name: "nickname",
        label: "Nickname",
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: "is_active",
        label: "Kích hoạt",
        options: {
          filter: true,
          customHeadRender: (columnMeta, handleToggleColumn) => {
            return (
              <th
                key={`head-th-${columnMeta.label}`}
                className="MuiTableCell-root MuiTableCell-head"
              >
                <div className="text-center">{columnMeta.label}</div>
              </th>
            );
          },
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <div className="text-center">
                <FormControlLabel
                  label={value ? "Có" : "Không"}
                  value={value ? "Có" : "Không"}
                  control={
                    <Switch
                      color="primary"
                      checked={value === 1}
                      value={value}
                    />
                  }
                  onChange={(event) => {
                    let checked = 1 - 1 * event.target.value;
                    this.handleChangeStatus(
                      checked,
                      this.state.data[tableMeta["rowIndex"]]
                        .customer_account_receive_id,
                      tableMeta["rowIndex"]
                    );
                  }}
                />
              </div>
            );
          },
        },
      },
      {
        name: "Thao tác",
        options: {
          filter: false,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <div className="text-center">
                <Button
                  color="warning"
                  title="Chi tiết"
                  className="mr-1"
                  onClick={(evt) =>
                    this.handleActionItemClick(
                      "detail",
                      this.state.data[tableMeta["rowIndex"]]
                        .customer_account_receive_id,
                      tableMeta["rowIndex"]
                    )
                  }
                >
                  <i className="fa fa-info" />
                </Button>
                <Button
                  color="success"
                  title="Chỉnh sửa"
                  className="mr-1"
                  onClick={(evt) =>
                    this.handleActionItemClick(
                      "edit",
                      this.state.data[tableMeta["rowIndex"]]
                        .customer_account_receive_id,
                      tableMeta["rowIndex"]
                    )
                  }
                >
                  <i className="fa fa-edit" />
                </Button>
                <Button
                  color="danger"
                  title="Xóa"
                  className=""
                  onClick={(evt) =>
                    this.handleActionItemClick(
                      "delete",
                      this.state.data[tableMeta["rowIndex"]]
                        .customer_account_receive_id,
                      tableMeta["rowIndex"]
                    )
                  }
                >
                  <i className="fa fa-trash" />
                </Button>
              </div>
            );
          },
        },
      },
    ];

    const { count, page, query } = this.state;
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
                <AccountReceivesFilter
                  userArr={this.state.user}
                  handleSubmit={this.handleSubmitFilter}
                  handleAdd={this.handleClickAdd}
                />
              </div>
            </CardBody>
          )}
        </Card>
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
      </div>
    );
  }
}

export default AccountReceive;
