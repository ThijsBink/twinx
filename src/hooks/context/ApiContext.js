import React, { useContext, useState } from 'react';
import { initializeIxon } from '../../api/ixon';
import useStore from '../store/useStore';
import { ACTIONS } from '../store/constants';

// import logger from '../../utils/logger';
// const log = logger('CONTEXT');

const ApiContext = React.createContext();
export const useApi = () => useContext(ApiContext);

export function ApiProvider({ children }) {
  const [client, setClient] = useState(null);
  const { isSaved, interpret, dispatch } = useStore({
    companies: [],
    agents: [],
    views: [],
  });

  async function login(authToken) {
    const ixon = await initializeIxon(authToken);
    setClient(ixon);

    if (!isSaved) {
      initializeStore(ixon);
    }
  }

  async function initializeStore(ixon) {
    const [companies, agents] = await ixon.requestCompaniesWithAgents();

    dispatch({
      type: ACTIONS.ADD_COMPANIES,
      payload: companies,
    });

    dispatch({
      type: ACTIONS.ADD_AGENTS,
      payload: agents.map((agent) => ({
        ...agent,
        layout: [],
      })),
    });
  }

  return (
    <ApiContext.Provider
      value={{
        login,
        logout: () => setClient(null),
        checkLogin: () => !!client,
        interpret,
        dispatch,
        client,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}
