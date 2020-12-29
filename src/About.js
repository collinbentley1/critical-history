import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';
import { useRoutes, usePath, A } from 'hookrouter';
import routes from './router';
import './About.css';

function About() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const routeResult = useRoutes(routes);
    const path = usePath();

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
            <Modal.Body style={{'maxHeight': 'calc(100vh - 210px)', 'overflowY': 'auto'}}>
                { routeResult }
            </Modal.Body>
            <Modal.Footer className="text-center justify-content-center">
                { path === '/privacy' ? <A href="/">About</A> : <A href="/privacy">Privacy Policy</A> }
            </Modal.Footer>
            </Modal>
        </>
      );
}

export default About;