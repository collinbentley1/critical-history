import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';
import { useRoutes, A } from 'hookrouter';
import routes from './router';
import './About.css';

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
            <Modal.Body>
                { routeResult }
            </Modal.Body>
            <Modal.Footer className="text-center justify-content-center">
                <A href="/privacy">Privacy Policy</A>
            </Modal.Footer>
            </Modal>
        </>
      );
}

export default About;