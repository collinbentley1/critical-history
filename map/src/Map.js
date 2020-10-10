import React from 'react';
import mapboxgl from 'mapbox-gl';
import Locations from './Locations'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Map.css'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: -72.92504,
      lat: 41.31171,
      zoom: 14.66
    };
  }

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/collinbentley1/ckd3kwqqw060a1iqgtjne8xs3',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    });
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
