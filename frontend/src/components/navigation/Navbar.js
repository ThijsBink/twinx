import React from 'react';

import { NavLink } from 'react-router-dom';
import AuthContext from '../../context/authContext';

const Navbar = () => {
  return (
    <AuthContext.Consumer>
      {(context) => (
        <header>
          <ul>
            <li>
              <NavLink to='/dashboard'>Dashboard</NavLink>
            </li>
            <li>
              <NavLink to='/users'>Users</NavLink>
            </li>
            <li>
              <button onClick={context.logout}>Logout</button>
            </li>
          </ul>
        </header>
      )}
    </AuthContext.Consumer>
  );
};

export default Navbar;