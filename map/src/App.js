import React, { useState } from 'react';
import './App.css';
import SiteNav from './SiteNav';
import Map from './Map';
import Introduction from './Introduction';
import GuidedContext from './guided-context';

function App() {
  const [guided, setGuided] = useState(false);
  const value = { guided, setGuided };


  return (
    <div className='App'>
      <GuidedContext.Provider value={value}>
        <SiteNav />
        <Map />
        <Introduction />
      </GuidedContext.Provider>
    </div>
  );
}

export default App;
