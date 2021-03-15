import React from 'react';

import { NavLink } from 'react-router-dom';
import AuthContext from '../../context/authContext';
import '../../css/Navbar.css';
import { Button, Nav, Navbar} from 'react-bootstrap';
import logo from '../../img/logo-bg-blue.jpeg';

const Navigbar = () => {
  return (
    <AuthContext.Consumer>
      {(context) => (
        <header className="header">
          <Navbar collapseOnSelect expand="lg" sticky="top" variant="dark"> 
            <Navbar.Brand href="#">
              <img className="logo-image" src={logo} alt="logo"></img>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
            <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto"> 
              <Nav.Link className="navText" to='/dashboard'>Dashboard</Nav.Link>
              <Nav.Link className="navText" to='/api'>Api</Nav.Link>
            </Nav>
            <Button className="btn-nav" inline  onClick={context.logout}>Logout</Button>
            </Navbar.Collapse>
          </Navbar>
        </header>
      )}
    </AuthContext.Consumer>
  );
};

export default Navigbar;
