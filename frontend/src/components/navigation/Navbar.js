import React from 'react';
import { NavLink } from 'react-router-dom';

import { useApi } from '../../hooks/context/ApiContext';

import './Navbar.css';
import logo from '../../img/logo-bg-blue.jpeg';

export default function Navbar() {
  const { logout } = useApi();

  return (
    <header className='navig-bar'>
      <div className="navbar-main">
        <div>
          <NavLink className="navigation" to='/dashboard'>
            <img className="nav-logo" src={logo} alt=""/>
          </NavLink>
        </div>
        <div>
          <ul>
            <li>
              <NavLink className="navigation" to='/dashboard'>Dashboard</NavLink>
            </li>
          </ul>
        </div>
        <div className="logout-container">
          <ul>
            <li>
              <button
              className="logout-btn navigation"
                onClick={() => {
                  logout();
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
