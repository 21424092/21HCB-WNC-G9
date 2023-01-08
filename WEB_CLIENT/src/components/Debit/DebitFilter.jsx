import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Input, Button, FormGroup, Col, Row } from "reactstrap";
class DebitsFilter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
    };
  }

  handleClickAdd = () => {
    window._$g.rdr("/list-of-receiving-accounts/add");
  };
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
    const { inputValue } = this.state;
    const { handleSubmit } = this.props;
    handleSubmit(inputValue);
  };

  onClear = () => {
    if (this.state.inputValue) {
      this.setState(
        {
          inputValue: "",
        },
        () => {
          this.onSubmit();
        }
      );
    }
  };

  render() {
    return (
      <Row className="w-100 d-flex flex-row justify-content-end align-items-center mb-2 mt-2 mr-2">
        <Col xs={4}>
          <FormGroup className="mb-2 ml-2 mb-sm-0">
            <Input
              className="MuiPaper-filter__custom--input"
              autoComplete="nope"
              type="text"
              name="inputValue"
              placeholder="-- Tìm --"
              value={this.state?.inputValue || ""}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown}
              inputprops={{
                name: "inputValue",
              }}
            />
          </FormGroup>
        </Col>
        <Col xs={1}>
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
        </Col>
        <Col xs={1}>
          <FormGroup className="mb-2 ml-2 mb-sm-0">
            <Button
              className="col-12 MuiPaper-filter__custom--button"
              onClick={() => this.handleClickAdd()}
              color="success"
              size="sm"
            >
              <i className="fa fa-plus" />
              <span className="ml-1">Thêm mới</span>
            </Button>
          </FormGroup>
        </Col>
      </Row>
    );
  }
}

DebitsFilter.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default DebitsFilter;
