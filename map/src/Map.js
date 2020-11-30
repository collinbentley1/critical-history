import React, { useState, useRef, useEffect, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carousel from 'react-bootstrap/Carousel';
import './Map.css';
import ReactMarkdown from 'react-markdown';
import GuidedContext from './guided-context';
import ExploreSidebar from './ExploreSidebar';

// Get locationData from combination of all JSON files in location folder
function importAll(r) {
  return r.keys().map(r);
}
const locationData = importAll(require.context('./locations', false, /\.json$/));

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;
 // React and Mapbox can be confusing to use together at first
  // because they both have state and modify a virtual DOM.
  // If you're familiar with React, you might be tempted to use
  // componentDidUpdate to act on changes made to the map, but
  // this won't work because the Mapbox maintains its own separate
  // state. The equivalent is using map.on('event', () => {})
const Map = () => {
  // Get context for right sidebar (varies depending on Explore or Guided Tour mode)
  const [ guided, setGuided ] = useContext(GuidedContext);

  // Get state for carousel (used in guided mode)
  const [index, setIndex] = useState(0);
  
  const mapContainerRef = useRef(null);
  const map = useRef();

  // Initialize map when component mounts
  useEffect(() => {
      map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/collinbentley1/ckd3kwqqw060a1iqgtjne8xs3?optimize=true',
      center:[-72.92889674697767, 41.311363185264725],
      zoom: 14.66,
    });
    // //DEBUG: Logs map location, zoom, and bearing
    // map.current.on('render', function() {
    //   console.log(map.current.getBearing(),
    //               map.current.getZoom(),
    //               map.current.getCenter(),
    //               map.current.getPitch());
    // });
    locationData.forEach(marker => {
      // Create a DOM element for marker
      var el = document.createElement('div');
      el.className = 'marker';
      // Add event listener on marker to adjust
      // location carousel when marker is clicked
      el.addEventListener('click', () => {
        setIndex(marker.id);
        setGuided(true);
      });
      // Create popup for marker (when clicked)
      var popup = new mapboxgl.Popup({offset: 25})
        .setText(marker.title);
      // Add marker to the map
      new mapboxgl.Marker(el)
        .setLngLat(marker.marker)
        .setPopup(popup)
        .addTo(map.current);
    });

    // Clean up on dismount
    return () => map.current.remove();
  }, []);  // [] in useEffect mimics componentDidMount(); (will run only once)

  // Function to update carousel state (used in guided mode)
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  // Build components for carousel (when in guided mode) 
  const locationComponents = locationData.sort(function(a, b) {
                              if (a.id < b.id) {
                                return -1;
                              }
                              if (a.id > b.id) {
                                return 1;
                              }
                              return 0;
                              }).map(function (location) {
                              return(
                              <Carousel.Item className="mt-2 pl-4 pr-4 text-center">
                                  <div className="mr-3 ml-3">
                                    <div className="d-flex mb-2 justify-content-center text-center">
                                      <h3>{location.title}</h3>
                                    </div>
                                    <div className="carousel-image mr-5 ml-5">
                                      <span class="image-credit">{location.image_credit}</span>
                                      <img
                                        className="rounded"
                                        src={location.image}
                                        alt={location.image_alt}
                                      />
                                    </div>
                                    <div className="d-flex mr-5 ml-5 mt-4 justify-content-center text-center">
                                      <ReactMarkdown 
                                          source={location.text}
                                          renderers={{link: LinkRenderer}}
                                      />
                                    </div>
                                  </div>
                              </Carousel.Item>
                              )});

  // Carousel hook: updates map when carousel index changes
  useEffect(() => {
    const newLocation = locationData.find(location => location.id === index);
    // Fly to new location
    map.current.flyTo(newLocation);
  }, [index]);

  // Hook: guided changes, fly map to the overview position
  useEffect(() => {
    // Fly to overview position
    if(guided === false) {
      map.current.flyTo({
        center:[-72.92889674697767, 41.311363185264725],
        zoom: 14.66,
        pitch: 0,
        bearing: 0,
      });
    }
    else {
      const newLocation = locationData.find(location => location.id === index);
      map.current.flyTo(newLocation);
    }
  }, [guided])

  // Link renderer: allow links to open in new tab
  function LinkRenderer(props) {
    return <a href={props.href} target="_blank" rel="noopener noreferrer">{props.children}</a>
  }

  return (
      <Container fluid className="h-100 overflow-hidden">
          <Row className="h-100">
            <Col xs lg="7" className="bg-gray text-white mt-5 pt-4 pl-0">
              <div className="map-wrapper">
                <div ref={mapContainerRef} className="map"/>
              </div>
            </Col>
            <Col xs lg="5" className="mt-5 pt-4">
              <div className="h-100 d-flex flex-column">
                <Row className="justify-content-center flex-grow-1 bg-light">
                  {guided ?                   
                            <Carousel activeIndex={index} onSelect={handleSelect} interval={null}>
                              {locationComponents}
                            </Carousel> 
                          : 
                          <ExploreSidebar />
                  }
                </Row>
              </div>
            </Col>            
          </Row>
        </Container>
    );
};
export default Map;