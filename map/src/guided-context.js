import React from 'react';

// Default navigation mode is free explore
const GuidedContext = React.createContext([
    false,
    () => {}
]);

export default GuidedContext;