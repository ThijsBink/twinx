import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { useApi } from './hooks/context/ApiContext';

import Navbar from './components/navigation/Navbar';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import AgentPage from './pages/Agent';

export default function Main() {
  const { checkLogin } = useApi();
  const isLoggedIn = checkLogin();

  return (
    <BrowserRouter>
      {isLoggedIn && <Navbar />}
      <Switch>
        {!isLoggedIn && <Route path='/' component={LoginPage} exact />}
        {isLoggedIn && (
          <Route path='/dashboard' component={DashboardPage} exact />
        )}
        {isLoggedIn && (
          <Route path='/agent/:agentId' component={AgentPage} exact />
        )}

        {!isLoggedIn && <Redirect to='/' exact />}
        {isLoggedIn && <Redirect to='/dashboard' exact />}
      </Switch>
    </BrowserRouter>
  );
}
