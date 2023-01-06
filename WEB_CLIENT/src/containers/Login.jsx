import React, { Component } from "react";
import {
  Container,
  Button,
  Row,
  Col,
  Card,
  CardBody,
  CardGroup,
} from "reactstrap";
import bg from "../assets/img/bg.jpeg";

/**
 * @class Login
 */
export default class Login extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        className="app flex-row align-items-center"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col md="5">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Button
                      type="button"
                      color="primary"
                      className="btn btn-primary col-12"
                      onClick={() => {
                        window._$g.rdr("/customer-login");
                      }}
                    >
                      KHÁCH HÀNG
                    </Button>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
            <Col md="5">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Button
                      type="button"
                      color="primary"
                      className="btn btn-primary col-12"
                      onClick={() => {
                        window._$g.rdr("/admin-login");
                      }}
                    >
                      QUẢN TRị VIÊN
                    </Button>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
