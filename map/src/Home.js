import React, { useState } from 'react';
import SiteNav from './SiteNav';
import Map from './Map';
import Introduction from './Introduction';
import GuidedContext from './guided-context';

function Home() {
  const [guided, setGuided] = useState(false);
  const value = { guided, setGuided };


  return (
    <div className='Home'>
      <GuidedContext.Provider value={value}>
        <SiteNav />
        <Map />
        <Introduction />
      </GuidedContext.Provider>
    </div>
  );
}

export default Home;
