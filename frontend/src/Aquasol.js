import React from 'react';

import Main from './Main';

import { ApiProvider } from './hooks/context/ApiContext';

export default function Aquasol() {
  return (
    <ApiProvider>
      <Main />
    </ApiProvider>
  );
}
