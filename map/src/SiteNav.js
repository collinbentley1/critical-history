import React, { useContext } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import logo from './logo.svg';
import './SiteNav.css';
import * as typeformEmbed from '@typeform/embed';
import GuidedContext from './guided-context';
import Button from 'react-bootstrap/Button';

// Create popup instance of Typeform
// Note: this could be done inside the component function
// using useRef()
const typeform = typeformEmbed.makePopup('https://cdbentley.typeform.com/to/fgEAT2ps', {
      mode: 'popup',
      openValue: 30,
      autoClose: 3,
      autoOpen: false,
      hideScrollbars: true,
    });

function SiteNav() {

  // Get context for right sidebar (varies depending on Explore or Guided Tour selection)
  const { guided, setGuided } = useContext(GuidedContext);

  return (
    <Navbar bg='light' expand='lg' className="fixed-top">
      <Navbar.Brand href='#home' className='brandName'>
        <img
          src={logo}
          width='46'
          height='46'
          alt='Critical History Map logo'
        />{' '}
        Critical History Map
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='navbar-nav' />
      <Navbar.Collapse id='navbar-nav'>
        <Nav className='ml-auto'>
          <Nav.Link href='#about'>About</Nav.Link>
          <Nav.Link href='#' onClick={() => typeform.open()}>Add Location</Nav.Link>
          <Nav.Link href='#' onClick={() => typeform.open()}>Contact Us</Nav.Link>
          <Button 
            variant='outline-secondary'
            onClick={guided ? () => setGuided(false) : () => setGuided(true)}
            >
              {guided ? 'Explore' : 'Guided Tour'}
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    );
}

export default SiteNav;
