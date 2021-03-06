import React from 'react';
import {message, Button, Form, Input, Select} from 'antd';
import axios from 'axios';

const {Option} = Select;

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    loading: false,
  };

  handleSubmit = e => {
    e.preventDefault ();
    let values = this.props.form.getFieldsValue ();
    let users = [], allUserNames = [];
    
    //check length of username and password
    if (values.username.length > 20) {
      message.error("User name should be no more than 20 characters.");
      return;
    }

    if (values.password.length > 20) {
      message.error("Password should be no more than 20 characters.");
      return;
    }

    // TODO: need better solution
    axios.get (`http://127.0.0.1:8000/user/api/`).then (res => {
      users = res.data;
      allUserNames = users.map (user => user.username);

      if (allUserNames.length > 0) {
        if (allUserNames.includes (values.username)) {
          message.error ('User existed. Please change a username.');
          return;
        }
        else{
          axios
          .post (`http://127.0.0.1:8000/user/api/signup/`, {
            username: values.username,
            password: values.password,
            role: values.role,
          })
          .then (res => {
            message.success ('You have signed up! Please log in!', 3);
            this.props.switchToLogin ();
          })
          .catch (err => {
            console.log (err);
          });
        }
      } else {
        axios
          .post (`http://127.0.0.1:8000/user/api/signup/`, {
            username: values.username,
            password: values.password,
            role: values.role,
          })
          .then (res => {
            message.success ('You have signed up! Please log in!', 3);
            this.props.switchToLogin ();
          })
          .catch (err => {
            console.log (err);
          });
      }
    });
  };


  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue ('password')) {
      callback ('Different');
    } else {
      callback ();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields (['confirm'], {force: true});
    }
    callback ();
  };

  render () {
    const {getFieldDecorator} = this.props.form;

    const formItemLayout = {
      labelCol: {xs: {span: 8, offset: 0}},
      wrapperCol: {xs: {span: 16}},
    };

    const tailFormItemLayout = {
      wrapperCol: {xs: {span: 16, offset: 8}},
    };

    return (
      <Form onSubmit={this.handleSubmit} {...formItemLayout}>
        <Form.Item label="Username">
          {getFieldDecorator ('username', {
            rules: [
              {required: true, message: 'Enter username!'},
              {whitespace: true, message: 'Enter username!'},
            ],
          }) (<Input />)}
        </Form.Item>
        <Form.Item label="Password">
          {getFieldDecorator ('password', {
            rules: [
              {required: true, message: 'Enter password!'},
              {validator: this.validateToNextPassword},
              {whitespace: true, message: 'Enter password!'},
            ],
          }) (<Input type="password" />)}
        </Form.Item>
        <Form.Item label="Confirm password">
          {getFieldDecorator ('confirm', {
            rules: [
              {required: true, message: 'Enter password!'},
              {validator: this.compareToFirstPassword},
            ],
          }) (<Input type="password" />)}
        </Form.Item>

        <Form.Item label="Role">
          {getFieldDecorator ('role', {
            initialValue: 'Developer/Product Owner',
          }) (
            <Select>
              <Option value="Scrum Master">Scrum Master</Option>
              <Option value="Developer/Product Owner">
                Developer/Product Owner
              </Option>
            </Select>
          )}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button
            type="primary"
            htmlType="submit"
            style={{width: '100%'}}
            loading={this.state.loading}
          >
            Sign up
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedRegistrationForm = Form.create ({name: 'register'}) (
  RegistrationForm
);

export default WrappedRegistrationForm;
