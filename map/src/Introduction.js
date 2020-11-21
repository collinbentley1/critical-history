import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './Introduction.css';
import logo from './logo.svg';

function Introduction() {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);

  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      dialogClassName="modal-100w"
      aria-labelledby="introduction-fullscreen-modal"
      centered>
      <Modal.Header className="justify-content-center">
      <img
          src={logo}
          width='100'
          height='100'
          alt='Critical History Map logo'

        />
      </Modal.Header>
      <Modal.Body className="text-center pl-5 pr-5 introduction-text">
      <h1>Critical History Map</h1>
      Yale University’s namesake is Elihu Yale, a slave trader and the governor of the British East India Company responsible for over a century of colonial rule in India. This Critical History Map was developed with two ambitions in mind: (1) to think about how Yale’s history as a colonial institution remains embedded in its architecture and landscape in the present-day and (2) to highlight sites where Yale students and New Haven residents have changed the course of the university’s history through remarkable moments of struggle.</Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant='secondary' onClick={handleClose}>
        Explore 
        </Button>
        <Button variant='primary' onClick={handleClose}>
        Guided Tour
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Introduction
