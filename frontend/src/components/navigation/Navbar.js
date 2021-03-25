import React from 'react';
import { NavLink } from 'react-router-dom';

import { useApi } from '../../hooks/context/ApiContext';

import './Navbar.css';

export default function Navbar() {
  const { logout } = useApi();

  return (
    <header className='navbar'>
      <ul>
        <li>
          <NavLink to='/dashboard'>Dashboard</NavLink>
        </li>
        <li>
          <button
            onClick={() => {
              logout();
            }}
          >
            Logout
          </button>
        </li>
      </ul>
    </header>
  );
}
