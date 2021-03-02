<<<<<<< HEAD
import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
=======
>>>>>>> 0ab6e925945f97e3ef78ce94f3223490ca362504

import AuthContext from './context/authContext';

import Navbar from './components/navigation/Navbar';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import UsersPage from './pages/Users';

export default class App extends Component {
  state = {
    loggedIn: true,
  };

  login = () => {
    this.setState({ loggedIn: true });
  };

  logout = () => {
    this.setState({ loggedIn: false });
  };

  render() {
    return (
      <BrowserRouter>
        <main className='main-content'>
          <AuthContext.Provider
            value={{ loggedIn: true, login: this.login, logout: this.logout }}
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
