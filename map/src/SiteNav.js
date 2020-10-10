import React from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import logo from './logo.svg'
import './SiteNav.css'

function SiteNav() {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home" className="brandName">
        <img
          src={logo}
          width="45"
          height="45"
          alt="React Bootstrap logo"
        />
        <a href="#home" class="ml-3">Critical History Map</a>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link href="#about">About</Nav.Link>
          <Nav.Link href="#about">Contribute</Nav.Link>
          <Nav.Link href="#contact">Contact Us</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    );
}

export default SiteNav;
