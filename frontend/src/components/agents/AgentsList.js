import React from 'react';

import AgentItem from './AgentItem';

import './AgentsList.css';

export default function AgentsList({ agents, companies }) {
  return (
    <div className='grid-container'>
      {agents.map((agent) => {
        return (
          <AgentItem
            key={agent.publicId}
            agent={agent}
            companyName={
              companies.find((company) => company.publicId === agent.companyId)
                .name
            }
          />
        );
      })}
    </div>
  );
}
