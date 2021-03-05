import React, { Component } from 'react';

import AuthContext from '../context/authContext';

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

    fetch('https://api.ayayot.com:443/access-tokens?fields=secretId', {
      method: 'POST',
      headers: {
        'Api-Version': '2',
        'Api-Application': 'UUdjNNsZ3Sn1',
        'Content-Type': 'application/json',
        Authorization: `Basic ${encodedAuth}`,
      },
      body: JSON.stringify({ expiresIn: 3600 }),
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        console.log(resData.data.secretId);
        if (resData.status === 'success') {
          this.context.login(resData.data.secretId);
        } else {
          console.log('Unauthorized');
        }
      })
      .catch((err) => console.log(err));
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
