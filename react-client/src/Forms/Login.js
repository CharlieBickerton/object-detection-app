import React, { Component } from "react";

import { Button, Form, Icon, Input, message, Spin } from "antd";

import { NavLink } from "react-router-dom";
import auth from "../utils/auth";
import history from "../utils/history";

class LoginForm extends Component {

  constructor(props) {
    super(props);
    this.state = { submitted: false };
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    // this.props.form.validateFields();
  }

  render() {

    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    // Only show error after a field is touched.
    const usernameError = isFieldTouched("username") && getFieldError("username");
    const passwordError = isFieldTouched("password") && getFieldError("password");

    function hasErrors(fieldsError) {
      return Object.keys(fieldsError).some((field) => fieldsError[field]);
    }

    if (this.state.submitted) {
      return (
        <div style={{ marginTop: "12%", textAlign: "center" }}>
          <Spin size="large" />
          <br/>
          <div>Authenticating</div>
        </div>
      );
    } else {
      return (
        <div style={{ marginTop: "0px", textAlign: "-webkit-center" }}>
          <h1 style={{marginTop: "8%"}}>Please Login</h1>
          <Form style={{marginTop: "2%", maxWidth: "300px", textAlign: "center" }} className="login-form" onSubmit={this.handleSubmit}>
            <Form.Item
              validateStatus={usernameError ? "error" : undefined}
              help={usernameError || ""}
            >
              {getFieldDecorator("username", {
                rules: [{ required: true, message: "Please input your username!" }],
              })(
                <Input prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />} placeholder="Username" />,
              )}
            </Form.Item>
            <Form.Item
              validateStatus={passwordError ? "error" : undefined}
              help={passwordError || ""}
            >
              {getFieldDecorator("password", {
                rules: [{ required: true, message: "Please input your Password!" }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
                  type="password" placeholder="Password"
                />,
              )}
            </Form.Item>
            <Form.Item>
              <Button className="login-form-button"
                type="primary"
                htmlType="submit"
                disabled={hasErrors(getFieldsError())}
              >
                Log in
              </Button>
            </Form.Item>
            Or <NavLink to="/register">register now!</NavLink>
          </Form>
        </div>
      );
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        try {
          this.setState({ submitted: true });
          await this.login(values.username, values.password);
        } catch (err) {
          this.setState({ submitted: false });
          return err;
        }
      }
    });
  }

  login = async (username, password) => {
    try {
      console.log('login')
      await auth.login(username, password);
      history.push("/app");
    } catch (error) {
      message.error("Incorrect username or password. Please try again or contact hello@kadlytics.com for help");
      console.error("Error during login:", error);
      throw error;
    }
  }
}
export default Form.create()(LoginForm);
