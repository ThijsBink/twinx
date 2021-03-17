import React, { useContext, useState } from 'react';

import { initializeIxon } from '../../api/ixon';

import useStore from '../store/useStore';
import { ACTIONS, INTERPRETERS } from '../store/constants';

import { formatDate } from '../../utils/date';

const ApiContext = React.createContext();
export const useApi = () => useContext(ApiContext);

export function ApiProvider({ children }) {
  const [client, setClient] = useState(null);
  const { isSaved, interpret, dispatch } = useStore({
    companies: [],
    agents: [],
  });

  async function login(authToken) {
    const ixon = await initializeIxon(authToken);
    setClient(ixon);

    if (!isSaved) {
      initializeStore(ixon);
    }
  }

  async function initializeStore(ixon) {
    const fetchedCompanies = await ixon.requestCompanies();
    dispatch({
      type: ACTIONS.ADD_COMPANIES,
      payload: { companies: fetchedCompanies },
    });
    console.log('COMPANIES SET TO', fetchedCompanies);

    let fetchedAgents = [];
    (
      await Promise.all(
        fetchedCompanies.map((company) => ixon.requestAgents(company.publicId))
      )
    )
      .map((companyAgents, i) =>
        companyAgents.map((agent) => ({
          ...agent,
          companyId: fetchedCompanies[i].publicId,
        }))
      )
      .forEach(
        (companyAgent) => (fetchedAgents = fetchedAgents.concat(companyAgent))
      );

    (
      await Promise.all(
        fetchedAgents.map((agent) =>
          ixon.requestTags(agent.companyId, agent.publicId)
        )
      )
    ).forEach((agentTags, i) => (fetchedAgents[i].tags = agentTags));
    (
      await Promise.all(
        fetchedAgents.map((agent) =>
          ixon.requestDataSources(agent.companyId, agent.publicId)
        )
      )
    ).forEach(
      (agentDataSources, i) => (fetchedAgents[i].dataSources = agentDataSources)
    );

    dispatch({
      type: ACTIONS.ADD_AGENTS,
      payload: {
        agents: fetchedAgents.map((agent) => ({
          publicId: agent.publicId,
          name: agent.name,
          companyId: agent.companyId,
          tags: agent.tags,
          dataSources: agent.dataSources,
          views: [],
        })),
      },
    });
    console.log('AGENTS SET TO', fetchedAgents);
  }

  async function fetchData(agentId, dataSourceId) {
    const tags = interpret({
      type: INTERPRETERS.GET_AGENT_USED_TAGS,
      params: {
        agentId,
      },
    });
    const agent = interpret({
      type: INTERPRETERS.GET_AGENT,
      params: {
        agentId,
      },
    });
    const dataBatches = await client.requestData(
      agent.companyId,
      tags, // tags.map((tag) => tag.tagId),
      dataSourceId,
      300
    );

    let data = {};
    /*
      {
        tagId: [{
          val
          time
        }]
      }
    */

    tags.forEach((tag) => (data[tag.publicId] = []));
    dataBatches.forEach((dataBatch) =>
      dataBatch.points.forEach((point) =>
        Object.keys(point.values).forEach((tagId) =>
          data[tagId].push({
            time: formatDate(point.time),
            value: point.values[tagId],
          })
        )
      )
    );

    console.log(data);
    return data;
  }

  function logout() {
    setClient(null);
  }

  return (
    <ApiContext.Provider
      value={{
        login,
        logout,
        checkLogin: () => !!client,
        interpret,
        dispatch,
        fetchData,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}
