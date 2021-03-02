import React from 'react';

export default React.createContext({
  loggedIn: null,
  login: () => {},
  logout: () => {},
});
