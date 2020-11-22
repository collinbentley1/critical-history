import React from 'react';
import './ExploreSidebar.css';

function ExploreSidebar() {
    return (
        <div class="align-self-center">
            <div class="d-flex justify-content-center pb-4">
                <img
                    class='sidebar-marker'
                    src='/images/marker.png'
                    width='40'
                    height='40'
                    alt='Map marker'
                />
            </div>
            <div class="d-flex justify-content-center">
                <h3 class="text-center">Select a location on the map to get started.</h3>
            </div>
        </div>
    );
}

export default ExploreSidebar;