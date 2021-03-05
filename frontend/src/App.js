import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthContext from './context/authContext';

import Navbar from './components/navigation/Navbar';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import UsersPage from './pages/Users';

export default class App extends Component {
  state = {
    token: null,
  };

  login = (token) => {
    this.setState({ token: token });
  };

  logout = () => {
    this.setState({ token: null });
  };

  render() {
    return (
      <BrowserRouter>
        <main className='main-content'>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              login: this.login,
              logout: this.logout,
            }}
          >
            {this.state.token && <Navbar />}
            <Switch>
              {!this.state.token && (
                <Route path='/' component={LoginPage} exact />
              )}
              {this.state.token && (
                <Route path='/dashboard' component={DashboardPage} exact />
              )}
              {this.state.token && (
                <Route path='/users' component={UsersPage} exact />
              )}

              {!this.state.token && <Redirect to='/' exact />}
              {this.state.token && <Redirect to='/dashboard' exact />}
            </Switch>
          </AuthContext.Provider>
        </main>
      </BrowserRouter>
    );
  }
}
