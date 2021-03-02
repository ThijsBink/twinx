import React, { Component } from 'react';

import AuthContext from '../context/authContext';

export default class Login extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);

    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  submitHandler = (event) => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    console.log(email, password);
    this.context.login();
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
          <div className='form-actions'>
            <button type='submit'>Login</button>
          </div>
        </form>
      </>
    );
  }
}
