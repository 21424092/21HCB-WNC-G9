import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Input, Button, Form, FormGroup, Label, Col, Row } from "reactstrap";
// Component(s)
import DatePicker from '../Common/DatePicker';
class DebitsFilter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleKeyDown = (event) => {
    if (1 * event.keyCode === 13) {
      event.preventDefault();
      this.onSubmit();
    }
  };

  onSubmit = () => {
    const { inputValue, created_date_from, created_date_to } = this.state;
    const { handleSubmit } = this.props;
    handleSubmit(
      inputValue,
      created_date_from
        ? created_date_from.format("DD/MM/YYYY")
        : created_date_from,
      created_date_to ? created_date_to.format("DD/MM/YYYY") : created_date_to
    );
  };

  onClear = () => {
    if (
      this.state.inputValue ||
      this.state.created_date_from ||
      this.state.created_date_to
    ) {
      this.setState(
        {
          inputValue: "",
          created_date_from: null,
          created_date_to: null,
        },
        () => {
          this.onSubmit();
        }
      );
    }
  };

  render() {
    return (
      <div className="ml-3 mr-3 mb-3 mt-3">
        <Form autoComplete="nope" className="zoom-scale-9">
          <Row>
            <Col xs={12} sm={6}>
              <FormGroup className="mb-2 mb-sm-0">
                <Label for="inputValue" className="mr-sm-2">
                  Từ khóa
                </Label>
                <Input
                  className="MuiPaper-filter__custom--input"
                  autoComplete="nope"
                  type="text"
                  name="inputValue"
                  placeholder=" Nhập tên nhóm quyền"
                  value={this.state.inputValue}
                  onChange={this.handleChange}
                  onKeyDown={this.handleKeyDown}
                  inputprops={{
                    name: "inputValue",
                  }}
                />
              </FormGroup>
            </Col>
            <Col xs={12} sm={6}>
              <FormGroup className="mb-2 mb-sm-0">
                <Label for="" className="mr-sm-2">
                  Thời gian tạo
                </Label>
                <Col className="pl-0 pr-0">
                  <DatePicker
                    startDate={this.state.created_date_from}
                    startDateId="created_date_from"
                    endDate={this.state.created_date_to}
                    endDateId="created_date_to"
                    onDatesChange={({ startDate, endDate }) =>
                      this.setState({
                        created_date_from: startDate,
                        created_date_to: endDate,
                      })
                    }
                    isMultiple
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>
        </Form>
        <div className="d-flex align-items-center mt-3">
          <div className="d-flex flex-fill justify-content-end">
            <FormGroup className="mb-2 ml-2 mb-sm-0">
              <Button
                className="col-12 MuiPaper-filter__custom--button"
                onClick={this.onSubmit}
                color="primary"
                size="sm"
              >
                <i className="fa fa-search" />
                <span className="ml-1">Tìm kiếm</span>
              </Button>
            </FormGroup>
            <FormGroup className="mb-2 ml-2 mb-sm-0">
              <Button
                className="mr-1 col-12 MuiPaper-filter__custom--button"
                onClick={this.onClear}
                size="sm"
              >
                <i className="fa fa-refresh" />
                <span className="ml-1">Làm mới</span>
              </Button>
            </FormGroup>
          </div>
        </div>
      </div>
    );
  }
}

DebitsFilter.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default DebitsFilter;
