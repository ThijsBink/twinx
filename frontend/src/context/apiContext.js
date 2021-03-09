import React from 'react';

export default React.createContext({
  token: null,
  applicationId: null,
  companyId: null,
  agents: [],
  sources: [],
});
