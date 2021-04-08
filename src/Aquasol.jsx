import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { ApiProvider, useApi } from './hooks/context/ApiContext';

import Navbar from './components/navigation/Navbar';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import AgentPage from './pages/Agent';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

const Main = () => {
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
};

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0049cb',
      dark: '#003899',
      light: '#025efc',
    },
    error: {
      light: '#ff4f4f',
      main: '#ff0000',
      dark: '#c10000',
    },
    success: {
      main: '#C8FC04',
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  typography: {
    subtitle1: {
      fontSize: 32,
      fontWeight: 'bold',
      textShadow: '2px 2px 2px #0000002f',
    },
    subtitle2: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    h5: {
      whiteSpace: 'nowrap',
    },
  },
});

const Aquasol = () => (
  <ApiProvider>
    <ThemeProvider theme={theme}>
      <Main />
    </ThemeProvider>
  </ApiProvider>
);

export default Aquasol;
