import React from 'react';

// Default navigation mode is free explore
const GuidedContext = React.createContext({
    guided: false,
    setGuided: () => {}
});

export default GuidedContext;