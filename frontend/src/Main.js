import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import Spinner from './components/spinner/Spinner';
import { useApi } from './hooks/context/ApiContext';

const Navbar = lazy(() => import('./components/navigation/Navbar'));
const LoginPage = lazy(() => import('./pages/Login'));
const DashboardPage = lazy(() => import('./pages/Dashboard'));
const AgentPage = lazy(() => import('./pages/Agent'));

export default function Main() {
  const { checkLogin } = useApi();
  const isLoggedIn = checkLogin();

  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner />}>
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
      </Suspense>
    </BrowserRouter>
  );
}
