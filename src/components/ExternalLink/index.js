import React from 'react';

const Link = ({ external, children }) => (
  <a href={external} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

export default Link;
