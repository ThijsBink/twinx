import React, { useState } from 'react';

import { useApi } from '../hooks/context/ApiContext';

import { Button, Form } from 'react-bootstrap';

import './Login.css';
import logo from '../img/logo.png';

export default function Login() {
  const { login } = useApi();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFA, setTwoFA] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    const encodedAuth = btoa(`${email}:${twoFA}:${password}`);
    login(encodedAuth);
  }

  return (
    <div className='login'>
      <div className='loginComponent'>
        <Form className='auth-form' onSubmit={handleSubmit}>
          <div className='logo-div'>
            <img className='logo-image' src={logo} alt='logo'></img>
          </div>
          <div className='form-control'>
            <Form.Control
              type='email'
              placeholder='Enter email'
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='form-control'>
            <Form.Control
              type='password'
              id='password'
              placeholder='Password'
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className='form-control'>
            <Form.Control
              type='text'
              id='twoFA'
              placeholder='Two-Factor Token'
              onChange={(e) => setTwoFA(e.target.value)}
            />
          </div>
          <div className='form-actions'>
            <Button className='log-btn' type='submit'>
              Login
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
