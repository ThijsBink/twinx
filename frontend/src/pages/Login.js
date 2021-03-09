import React, { Component } from 'react';

import AuthContext from '../context/authContext';

import { getAccessToken } from '../api/endpoints';
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
      <>
        <h1>Login Page</h1>
        <form className='auth-form' onSubmit={this.submitHandler}>
          <div className='form-control'>
            <label htmlFor='email'>E-mail</label>
            <input type='email' id='email' ref={this.emailEl} />
          </div>
          <div className='form-control'>
            <label htmlFor='password'>Password</label>
            <input type='password' id='password' ref={this.passwordEl} />
          </div>
          <div className='form-control'>
            <label htmlFor='twoFA'>Two-Factor Token (if enabled)</label>
            <input type='text' id='twoFA' ref={this.twoFAEl} />
          </div>
          <div className='form-actions'>
            <button type='submit'>Login</button>
          </div>
        </form>
      </>
    );
  }
}
