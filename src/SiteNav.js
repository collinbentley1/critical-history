import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import * as typeformEmbed from '@typeform/embed';
import About from './About';
import GuidedContext from './guided-context';
import logo from './logo.svg';
import './SiteNav.css';

// Create popup instance of Typeform
// Note: this could be done inside the component function using useRef()
const typeform = typeformEmbed.makePopup('https://cdbentley.typeform.com/to/fgEAT2ps', {
      mode: 'popup',
      openValue: 30,
      autoClose: 3,
      autoOpen: false,
      hideScrollbars: true,
    });

function SiteNav() {
  // Get context for right sidebar (varies depending on Explore or Guided Tour selection)
  const [ guided, setGuided ] = useContext(GuidedContext);
  return (
    <Navbar bg='light' expand='lg' className="fixed-top">
      <Navbar.Brand href='/' className='brandName'>
        <img
        className="mr-3"
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
          <About />
          <Nav.Link className="pl-3 pr-3" onClick={() => typeform.open()}>Add Location</Nav.Link>
          <Nav.Link className="pl-3 mr-4" onClick={() => typeform.open()}>Contact Us</Nav.Link>
          <Button 
            className="pl-4 pr-4 mr-2"
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