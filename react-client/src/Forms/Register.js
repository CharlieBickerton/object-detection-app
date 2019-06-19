import React, { Component } from "react";
import { Button, Form, Icon, Input, message, Spin } from "antd";
import auth from "../utils/auth";
import history from "../utils/history";


class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      submitted: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    // this.props.form.validateFields();
  }

  render() {

    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    // Only show error after a field is touched.
    const usernameError = isFieldTouched("username") && getFieldError("username");
    const emailError = isFieldTouched("email") && getFieldError("email");
    const passwordError = isFieldTouched("password") && getFieldError("password");

    function hasErrors(fieldsError) {
      return Object.keys(fieldsError).some((field) => fieldsError[field]);
    }

    if (this.state.submitted) {
      return (
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <Spin size="large" />
          <br/>
          <div>Authenticating</div>
        </div>
      );
    } else {
      return (
        <div style={{ marginTop: "0px", textAlign: "-webkit-center" }}>
          <h1 style={{marginTop: "8%"}}>Please Register</h1>
          <Form style={{marginTop: "2%", maxWidth: "300px", textAlign: "center" }} className="login-form"
            onSubmit={this.handleSubmit}>
            <Form.Item
              validateStatus={usernameError ? "error" : undefined}
              help={usernameError || ""}
            >
              {getFieldDecorator("username", {
                rules: [{
                  required: true, message: "Please input your username!",
                }, {
                  validator: this.validateUniqueUsername,
                }],
              })(
                <Input prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />} placeholder="Username" />,
              )}
            </Form.Item>
            <Form.Item
              validateStatus={emailError ? "error" : undefined}
              help={emailError || ""}
            >
              {getFieldDecorator("email", {
                rules: [{
                  type: "email", message: "Please enter a valid email.",
                }, {
                  required: true, message: "Please input your E-mail!",
                }],
              })(
                <Input prefix={<Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />} placeholder="Email" />,
              )}
            </Form.Item>
            <Form.Item
              validateStatus={passwordError ? "error" : undefined}
              help={passwordError || ""}
            >
              {getFieldDecorator("password", {
                rules: [{ required: true, message: "Please input your Password" }
                , {
                  validator: this.validateToNextPassword,
                }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
                type="password" placeholder="Password" />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator("confirm", {
                rules: [{ required: true, message: "Please confirm your Password" },
                {
                  validator: this.compareToFirstPassword,
                }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
                type="password" placeholder="Confirm Password" />,
              )}
            </Form.Item>
            <Form.Item style={{margin: "10px"}}>
              <Button className="login-form-button"
                type="primary"
                htmlType="submit"
                disabled={hasErrors(getFieldsError())}
              >
                Register
              </Button>
            </Form.Item>
            Or <a href="/login">Login</a>
          </Form>
        </div>
      );
    }
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("Please enter consistent passwords.");
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty ) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  }

  validateUniqueUsername = (rule, value, callback) => {
    const usernames = [];
    if (usernames.indexOf(value) > -1) {
      callback("Username taken");
    } else {
      callback();
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ submitted: true });
        this.register(values.username, values.email, values.password);
      }
    });
  }

  register = async (username, email, password) => {
    try {
      await auth.register(username, email, password)
      history.push('/app')
    } catch (error) {
      message.error("Failed to register user. Username or email address is already in use");
      console.error("Register error:", error);
      this.setState({submitted: false});
      return error;
    }
    // console.log("refetch user after register");
  }
}

export default Form.create()(Register);
