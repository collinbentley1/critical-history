import React from "react";
import AboutBody from './AboutBody';
import AboutPrivacy from './AboutPrivacy';

const routes = {
    '/' : () => <AboutBody />,
    '/privacy' : () => <AboutPrivacy />
  };
  
  export default routes;