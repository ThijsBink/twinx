import React from 'react';

import AgentsList from '../components/agents/AgentsList';

import { INTERPRETERS } from '../hooks/store/constants';
import { useApi } from '../hooks/context/ApiContext';

export default function Dashboard() {
  const { interpret } = useApi();

  const companies = interpret({
    type: INTERPRETERS.GET_COMPANIES,
  });

  const agents = interpret({
    type: INTERPRETERS.GET_AGENTS,
  }).map(({ publicId, name, companyId }) => ({ publicId, name, companyId }));

  return (
    <>
      <h1>Dashboard</h1>
      <AgentsList companies={companies} agents={agents} />
    </>
  );
}
