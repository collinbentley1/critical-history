import React from 'react';
import './ExploreSidebar.css';

function ExploreSidebar() {
    return (
        <div className="align-self-center">
            <div className="d-flex justify-content-center pb-4">
                <img
                    className='sidebar-marker'
                    src='/images/marker.png'
                    width='40'
                    height='40'
                    alt='Map marker'
                />
            </div>
            <div className="d-flex justify-content-center">
                <h3 className="text-center">Select a location on the map to get started.</h3>
            </div>
        </div>
    );
}

export default ExploreSidebar;