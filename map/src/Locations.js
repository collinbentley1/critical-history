import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel'
import locationData from './locationData.js'
import './Locations.css'

function Locations() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const locationComponents = locationData.map(function (location) { return(
    <Carousel.Item>
        <img
          className="d-block w-450"
          src={location.image}
          alt={location.image_alt}
        />
        <Carousel.Caption>
          <h3>{location.title}</h3>
          <p>{location.simple}</p>
          <p>{location.center}, {location.bearing}, {location.pitch}, {location.speed}, {location.zoom}</p>
        </Carousel.Caption>
    </Carousel.Item>
  )});

  return (
    <Carousel activeIndex={index} onSelect={handleSelect} interval={null}>
      {locationComponents}
    </Carousel>
    );
}


export default Locations
