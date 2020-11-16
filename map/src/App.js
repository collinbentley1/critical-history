import React from 'react';
import logo from './logo.svg';
import './App.css';
import SiteNav from './SiteNav';
import Map from './Map';
import Introduction from './Introduction'

function App() {
  return (
    <div className='App'>
      <SiteNav />
      <Map />
      <Introduction />
    </div>
  );
}

export default App;