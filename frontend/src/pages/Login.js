import React, { Component } from 'react';
import AuthContext from '../context/authContext';
import { getAccessToken } from '../api/endpoints';
import '../css/Login.css';
import { Button, Form} from 'react-bootstrap';
import logo from '../img/logo.png';


// import { getAccessToken } from '../api/user';

export default class Login extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);

    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
    this.twoFAEl = React.createRef();
  }

  submitHandler = (event) => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;
    const twoFA = this.twoFAEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    const encodedAuth = btoa(`${email}:${twoFA}:${password}`);
    getAccessToken('UUdjNNsZ3Sn1', encodedAuth).then((res) =>
      this.context.login(res[0])
    );
  };

  render() {
    return (
      <div className="login">
        <div className="loginComponent">
          <Form className='auth-form' onSubmit={this.submitHandler}>
            <div className="logo-div">
              <img className="logo-image" src={logo} alt="logo"></img>
            </div>
            <div className='form-control'>
              <Form.Control type="email" placeholder="Enter email" ref={this.emailEl} />
            </div>
            <div className='form-control'>
              <Form.Control type='password' id='password' placeholder="Password" ref={this.passwordEl} />
            </div>
            <div className='form-control'>
              <Form.Control type='text' id='twoFA' placeholder="Two-Factor Token" ref={this.twoFAEl} />
            </div>
            <div className='form-actions'>
              <Button className="log-btn" type='submit'>Login</Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}
