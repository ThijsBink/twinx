import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthContext from './context/authContext';

import Navbar from './components/navigation/Navbar';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import UsersPage from './pages/Users';

export default class App extends Component {
  state = {
    loggedIn: true,
  };

  login = (email, pass, twoFA) => {
    console.log(email, pass, twoFA)
    const encodeString = btoa(`${email}:${twoFA}:${pass}`);
    var myHeaders = new Headers();
    myHeaders.append("Api-Version", "2");
    myHeaders.append("Api-Application", "UUdjNNsZ3Sn1");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Basic ${encodeString}`);
  
    var raw = JSON.stringify({
      "expiresIn": 5184000
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://api.ayayot.com:443/access-tokens?fields=secretId", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status === 'success') {
          this.setLogin();
        } else {
          console.log("Unauthorized")
        }
      })
      .catch(error => console.log('error', error));
  };

  setLogin = () => {
    this.setState({ loggedIn: true });
  }

  logout = () => {
    this.setState({ loggedIn: false });
  };

  render() {
    return (
      <BrowserRouter>
        <main className='main-content'>
          <AuthContext.Provider
            value={{ loggedIn: false, login: this.login, logout: this.logout }}
          >
            {this.state.loggedIn && <Navbar />}
            <Switch>
              {!this.state.loggedIn && (
                <Route path='/' component={LoginPage} exact />
              )}
              {this.state.loggedIn && (
                <Route path='/dashboard' component={DashboardPage} exact />
              )}
              {this.state.loggedIn && (
                <Route path='/users' component={UsersPage} exact />
              )}

              {!this.state.loggedIn && <Redirect to='/' exact />}
              {this.state.loggedIn && <Redirect to='/dashboard' exact />}
            </Switch>
          </AuthContext.Provider>
        </main>
      </BrowserRouter>
    );
  }
}
