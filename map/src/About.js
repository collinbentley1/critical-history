import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';
import './About.css';

function About() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
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
            <h1 className="pt-1 pb-2">About</h1>
            <p>Yale University’s namesake is Elihu Yale, a slave trader and the governor of the British East India Company responsible for over a century of colonial rule in India. This Critical History Map was developed with two ambitions in mind: (1) to think about how Yale’s history as a colonial institution remains embedded in its architecture and landscape in the present-day and (2) to highlight sites where Yale students and New Haven residents have changed the course of the university’s history through remarkable moments of struggle.</p>
            {/* TODO: This should be a button that toggles a state which is normally false, andn
            if the state is true, then the about text is hidden and the privacy text is shown (overflow scroll)
            and the button in the privacy can bring back to about? does this require context?? I hope not. */}
            <a href="/privacy.html" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            </Modal.Body>
            </Modal>
        </>
      );
}

export default About;