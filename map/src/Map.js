import React from 'react';
import mapboxgl from 'mapbox-gl';
import Locations from './Locations'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Map.css'
import locationData from './locationData.js'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLoc: {lng: -72.92889674697767,
      lat: 41.311363185264725,
      zoom: 14.66},
      locationData: locationData
    }
  }


  // React and Mapbox can be confusing to use together at first
  // because they both have state and modify a virtual DOM.
  // If you're familiar with React, you might be tempted to use
  // componentDidUpdate to act on changes made to the map, but
  // this won't work because the Mapbox maintains its own separate
  // state. The equivalent is using map.on('event', () => {})

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/collinbentley1/ckd3kwqqw060a1iqgtjne8xs3',
      center: [this.state.currentLoc.lng, this.state.currentLoc.lat],
      zoom: this.state.currentLoc.zoom
    });

    // DEBUG: Logs map location, zoom, and bearing
    map.on('render', function() {
      console.log(map.getBearing(), map.getZoom(), map.getCenter());
    });

    locationData.forEach(marker => {
      // Create a DOM element for marker
      var el = document.createElement('div');
      el.className = 'marker';
      // Add event listener on marker
      el.addEventListener('click', () => {
        console.log(marker.title);
      });
      // Create popup for marker (when clicked)
      var popup = new mapboxgl.Popup({offset: 25})
        .setText(marker.title);
      // Add marker to the map
      new mapboxgl.Marker(el)
        .setLngLat(marker.marker)
        .setPopup(popup)
        .addTo(map);
    });

    // for (var i = 0; i < this.state.locationData.length; i++) {
    //   var location = this.state.locationData[i];
    //   if (location.hasOwnProperty('marker')) {
    //     // Create virtual DOM element for marker
    //     var el = document.createElement('div');
    //     el.className = 'marker';
    //     // Create popup for marker (when hovered or clicked)
    //     var popup = new mapboxgl.Popup({offset: 25})
    //       .setText(location.title);
    //     // Set location and popup and add Marker to map
    //     var marker = new mapboxgl.Marker(el)
    //       .setLngLat(location.marker)
    //       .setPopup(popup)
    //       .addTo(map);
    //     // Add event listener to marker
    //     el. addEventListener('click', () => {
    //       console.log(location.title, ' clicked.');
    //     });
    //   }
    // }
  }



  render () {
    return (
      <Container fluid className="h-100">
          <Row className="h-100">
            <Col xs lg="7" className="bg-gray text-white mt-5 pt-4 pl-0">
              <div className="map-wrapper">
                <div ref={el => this.mapContainer = el} className="map-container"/>
              </div>
            </Col>
            <Col xs lg="5" className="mt-5 pt-4">
              <div className="h-100 d-flex flex-column">
                <Row className="justify-content-center flex-grow-1 bg-purple">
                  <Locations />
                </Row>
              </div>
            </Col>            
          </Row>
        </Container>
    );
  }
}

export default Map
