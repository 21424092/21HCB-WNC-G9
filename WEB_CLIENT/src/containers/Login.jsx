import React, { Component } from "react";
import { Container } from "reactstrap";
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
        <Container></Container>
      </div>
    );
  }
}
