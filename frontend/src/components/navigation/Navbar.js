import React from 'react';
import { useApi } from '../../hooks/context/ApiContext';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { Button, Nav, Navbar} from 'react-bootstrap';
import logo from '../../img/logo-bg-blue.jpeg';

export default function Navigbar() {
const { logout } = useApi();

  return (
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
        <Button className="btn-nav" inline  onClick={() => {logout()}}>Logout</Button>
        </Navbar.Collapse>
      </Navbar>
    </header>
  )
};

