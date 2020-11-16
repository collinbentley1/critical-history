import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel'
import locationData from './locationData.js'
import './Locations.css'
import MapContext from './mapContext'

class Locations extends React.Component {
  componentDidMount() {
    this.map = this.context;
    console.log(this.map);
    console.log('hello');
   this.locationComponents = locationData.sort((a, b) => {
                                            if (a.id < b.id) {
                                              return -1;
                                            }
                                            if (a.id > b.id) {
                                              return 1;
                                            }
                                            return 0;  // A is equal to B
                                          }).map(function (location) { return(
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

  }

  render () {
    return (

    <Carousel interval={null}>
      {this.locationComponents}
    </Carousel>
);

  }


}

// function Locations(props) {

//   const [index, setIndex] = useState(0);
//   const { map } = this.context;

//   console.log(props);
 
//   const handleSelect = (selectedIndex, e) => {
//     setIndex(selectedIndex);
//   };

//   // Map.on flyto instead of just a simple use effect!
//   // If this doesn't work, it's ok, maybe this logic just
//   // needs to go in Map.js, or maybe there's some way of accessing
//   // the map from children components --> look in the Mapbox API 
//   // documentation to find more 
//   useEffect(() => {
//     console.log(index);
//     // map.flyTo(locationData.id(index).center);
//   }, [index]);


//   const locationComponents = locationData.sort((a, b) => {
//                                             if (a.id < b.id) {
//                                               return -1;
//                                             }
//                                             if (a.id > b.id) {
//                                               return 1;
//                                             }
//                                             return 0;  // A is equal to B
//                                           }).map(function (location) { return(
//     <Carousel.Item>
//         <img
//           className="d-block w-450"
//           src={location.image}
//           alt={location.image_alt}
//         />
//         <Carousel.Caption>
//           <h3>{location.title}</h3>
//           <p>{location.simple}</p>
//           <p>{location.center}, {location.bearing}, {location.pitch}, {location.speed}, {location.zoom}</p>
//         </Carousel.Caption>
//     </Carousel.Item>
//   )});

//   return (
//     <Carousel activeIndex={index} onSelect={handleSelect} interval={null}>
//       {locationComponents}
//     </Carousel>
//     );
// }


export default Locations
