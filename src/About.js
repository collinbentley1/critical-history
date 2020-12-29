import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';
import AboutBody from './AboutBody';
import AboutPrivacy from './AboutPrivacy';
import './About.css';

import { useRoutes } from 'hookrouter';

const routes = {
    '/' : () => <AboutBody />,
    '/privacy' : () => <AboutPrivacy />
}

function About() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const routeResult = useRoutes(routes);

    return (
        <>
            <Nav.Link onClick={handleShow} className="pl-3 pr-3">About</Nav.Link>
            <Modal 
            show={show} 
            onHide={handleClose}
            dialogClassName="modal-100w"
            aria-labelledby="about-fullscreen-modal"
            centered>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body className="text-center pl-5 pr-5 mb-3 about-text">
                { routeResult }
            </Modal.Body>
            </Modal>
        </>
      );
}

export default About;