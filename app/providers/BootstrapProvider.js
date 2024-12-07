// app/providers/BootstrapProvider.js
'use client';

import { useEffect } from 'react';

export default function BootstrapProvider({ children }) {
  useEffect(() => {
    require('bootstrap/dist/css/bootstrap.css');
  }, []);

  return children;
}